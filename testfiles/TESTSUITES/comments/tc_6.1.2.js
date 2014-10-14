/* 
 Author: Arko
 Description:    This is a casperjs automated test script To write a comment for the currently loaded notebook in the comment div provided in the
 right-side of the page


 */

//Begin Tests


casper.test.begin("Comment for a notebook", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var title;//store notebook title
    var comment = "First comment";//the comment to be entered
    var functions = require(fs.absolute('/home/arko/Downloads/SLIMER-CASPER/casperjs/testsuites/basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('/home/arko/Downloads/SLIMER-CASPER/casperjs/jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //enter the comment
    functions.comments(casper, comment);

    functions.delete_notebooksIstarred(casper);
    casper.run(function () {
        test.done();
    });
});
