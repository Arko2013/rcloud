/*

 Author: Kunal
 Description:This is a casperjs automation script for notebook containing one R cell and one RMarkdown cell with some code
 which is already executed and Run all button is then clicked and checked whether the R and markdown cell are
 executed or no.

 */
casper.test.begin("Execute pre executed a R cell and Markdown cell using Run All", 8, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "50+50" ;
    var expected_result = "100\n";

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

    //Added a new R cell and execute contents
    casper.then(function () {
        functions.addnewcell(casper);
        functions.addcontentstocell(casper,input_code);

    });

    //Change the language of prompt cell to Markdown cell . Pass 1 for Markdown, 2 for Python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 1;
            return true;
        });
    });

    //Add a Markdown cell and execute its contents
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", input_code);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'})
        this.wait(5000);
        this.echo("executed contents of the Markdown cell");

    });

    //Now we have 2 cells with some codes pre-executed . Will execute it using Run All
    functions.runall(casper);
    casper.then(function () {
        this.test.assertVisible('.r-result-div > pre:nth-child(2) > code:nth-child(1)', "Output div is visible which means that cell execution has occured successfully");
		var result_rcell = this.fetchText({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div[1]/div[3]/div[2]/pre[2]/code'});//fetch the output after execution
		var res_rcell = result_rcell.substring(7);//remove the unwanted characters
		this.echo("The output of the R code for the R cell  is : " + res_rcell);
		this.test.assertEquals(res_rcell, expected_result, "The R code has produced the expected output using Run All for the R cell"); 
		this.wait(4000);
		var result_markdwn = this.fetchText({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div[2]/div[3]/div[2]/p'});//fetch the output after execution
        this.echo("The output of the R code for the RMarkdown cell  is : " + result_markdwn);
        this.test.assertEquals(result_markdwn, input_code, "The R code executed in Markdown cell has produced the expected output using Run All"); 
		
    });

    casper.run(function () {
        test.done();
    });
});
