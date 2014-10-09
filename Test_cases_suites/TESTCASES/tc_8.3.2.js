/*

 Author: Kunal
 Description:This is a casperjs automation script to insert a Rmarkdown cell with respect to a Rmarkdown cell i.e,
 insert a Rmarkdown cell by clicking on the '+' icon present on top of the Rmarkdown Cell.


 */
casper.test.begin("Insert a Rmarkdown cell with a Rmarkdown cell", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
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

    //Change the language of prompt cell to Markdown cell. Select 1 for markdown and 2 for python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 1;
            return true;
        });
    });

    //Added a markdown cell and execute contents
    casper.then(function () {
        functions.addnewcell(casper);
        functions.addcontentstocell(casper);
    });

    // Add another markdown cell and execute contents
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-plus-sign').click();

        });
        this.wait(5000);
        this.test.assertElementCount({type: 'css', path: 'div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)'}, 2, "New cell created");
    });


    casper.run(function () {
        test.done();
    });
});
