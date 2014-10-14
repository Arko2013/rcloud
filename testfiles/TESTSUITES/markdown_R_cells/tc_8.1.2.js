/*

 Author: Arko
 Description:This is a casperjs automation script to run a code written in the Rmarkdown cell, use either the 'run' icon or 'result' icon,
 present on the side of the respective Rmarkdown cell or 'ctrl+enter' from keyboard

 */
casper.test.begin("Run a code in a Markdown cell", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "hello";
    
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

    //add a new markdown cell and execute its contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper,input_code);

    //verify that the cell execution has occured properly
    casper.viewport(1366, 768).then(function () {
        this.test.assertExists({type: 'css', path: '.r-result-div'}, "Output div is dispalyed.Confirmed that markdown cell has been executed successfully ");
    
    });


    casper.run(function () {
        test.done();
    });
});
