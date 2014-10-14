/*

 Author: Arko
 Description:The loaded notebook contains a Rmarkdown cell with some code but is not executed. On clicking the 'Run All' icon present on the top-left
 corner of the page should execute the cell

 */

//Begin Test

casper.test.begin("Execute Rmarkdown cell (not pre-executed) using Run All", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "hello" ;

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

    //Change the language of prompt cell to Markdown cell.Select 1 for markdown and 2 for python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 1;
            return true;
        });
    });

    //create a new markdown cell with some contents
    casper.then(function () {
        functions.addnewcell(casper);
        casper.then(function(){
			this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', input_code);
			this.echo("Entered code into the cell but did not execute it yet");
		});
    });

    //Now we have a Markdown cell with some code . Will execute it using Run All
    functions.runall(casper);
    casper.then(function () {
        this.test.assertVisible('.r-result-div > p:nth-child(1)', "Output div is visible which means that cell execution has occured successfully");
		var result = this.fetchText({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div/div[3]/div[2]/p'});//fetch the output after execution
        this.test.assertEquals(result, input_code, "The R code executed in Markdown cell has produced the expected output using Run All");        
    });

    casper.run(function () {
        test.done();
    });
});
