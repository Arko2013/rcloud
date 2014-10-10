/*

 Author: Kunal
 Description:This is a casperjs automation script for checking that The loaded notebook will contain RMarkdown cell which has been executed.
 Now, edit the content of that cell and execute it using the 'Run All' icon present on the top-left corner of the page.
 Check whether the changes are saved or not
 */
casper.test.begin(" Edit Rmarkdown cell (Pre-executed)", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var cellcontent = "654";//content to be added while modifying the cell
    var initialcontent;//stores initial content of the cell

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

    //Added a markdown cell and execute the contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper);
    //storing the initial cell content
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.wait(2000);
    });

    casper.then(function () {
        initialcontent = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
        this.wait(2000);
    });

    functions.runall(casper);

    //Reloading the page
    casper.viewport(1366, 768).then(function () {
        //this.wait(30000);
        this.reload(function () {
            this.echo("Main Page loaded again");
            this.wait(8000);
        });
    });

    casper.viewport(1366, 768).then(function () {
        //checking whether contents are written on markdowncell or not
        var temp = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
        this.test.assertEquals(temp, initialcontent, "Confirmed that content in the markdown cell has been saved using Run All feature");
    });


    casper.run(function () {
        test.done();
    });
});
