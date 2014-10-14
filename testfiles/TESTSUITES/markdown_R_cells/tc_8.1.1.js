/*

 Author: Arko
 Description:This is a casperjs automation script to write a code in the RMarkdown cell of loaded notebook

 */
casper.test.begin("Write some code in a Markdown cell", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var cellcontent = "hello";
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

    //Added a markdown cell and enter some contents
    casper.then(function () {
        functions.addnewcell(casper);
        this.wait(2000);
        this.then(function () {
            this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', cellcontent);
        });
    });

    casper.viewport(1366, 768).then(function () {
        this.wait(10000);
        //checking whether contents are written on Rmarkdown cell or no
        var temp = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});//fetch content from the Markdown cell
        this.test.assertEquals(temp, cellcontent, "Confirmed that content correctly entered into the markdown cell");
    });


    casper.run(function () {
        test.done();
    });
});
