/* 
 Author: Arko
 Description:Some activities in RCloud can display messages in the Sessions div. One such example is while exporting a notebook as R File.This
 automated script demonstrates the same
 */

//Begin Tests

casper.test.begin("Session div messages", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('/home/arko/Downloads/SLIMER-CASPER/casperjs/testsuites/basicfunctions'));

    casper.start(rcloud_url, function () {
    });

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.wait(10000);


    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        var title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //create a new cell and execute some contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper);

    //exporting notebook as R file
    functions.open_advanceddiv(casper);
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('#export-notebook-as-r').click();
        });
        this.wait(5000);
        this.echo("Export notebook as R file option has been clicked");
    });

    casper.then(function () {
        this.echo("Session div message after Exporting the notebook as R file :");
        this.echo(this.fetchText({type: 'css', path: '#session-info-out'}));
        this.test.assertTextExists("output file", "Confirmed that Sessions div message is displayed after notebook successfully exported as R file");

    });

    functions.delete_notebooksIstarred(casper);

    casper.run(function () {
        test.done();
    });
});
