/*

 Author: Kunal
 Description:This is a casperjs automation script for checking The loaded notebook will contain Rmarkdown cell which has been executed.
 Now, edit the content of that cell and execute it using the 'run' or 'result' icon present on the side of the cell
 or using 'ctrl+enter' option from keyboard. Check whether the changes are saved or not.
 */
casper.test.begin("Edit Rmarkdown Cell (one Rmarkdown cell unexecuted)", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
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

    //Added a markdown cell and enter some content but don't execute them
    functions.addnewcell(casper);
    casper.then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', "hello");
        this.wait(2000);
    });

    //Modify the contents of the cell
    casper.then(function () {
        this.echo("Now we have a markdown cell with some unexecuted cell,which is the pre-requisite for this test case");
        functions.addcontentstocell(casper);
    });

    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.wait(3000);
        initialcontent = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
    });

    //Reloading the page
    casper.viewport(1366, 768).then(function () {
        //this.wait(30000);
        this.reload(function () {
            this.echo("Main Page loaded again");
            this.wait(8000);
        });
    });

    //Checking the markdown cell contents
    casper.viewport(1366, 768).then(function () {
        //checking whether contents are written on markdown cell or not
        var temp = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
        this.test.assertEquals(temp, initialcontent, "Confirmed that content in the markdown cell has been saved after execution");
    });


    casper.run(function () {
        test.done();
    });
});
