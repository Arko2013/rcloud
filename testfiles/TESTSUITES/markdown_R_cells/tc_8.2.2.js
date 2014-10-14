/*

 Author: Arko
 Description:This is a casperjs automation script to Delete a cell, navigate to another notebook, then navigate back, the deleted cell should remain
 deleted.
 */
casper.test.begin("Delete a Rmarkdown cell and switch notebook", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;
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

    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

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

    //delete the markdown cell
    casper.viewport(1366, 768).then(function () {
        this.test.assertTruthy(this.click({type: 'css', path: '.icon-trash'}), "Confirmed that cell has been deleted successfully");
    });

    //create another notebook
    functions.create_notebook(casper);

    //load the previous notebook and check if markdown cell is still deleted
    casper.then(function () {
        var counter1 = 0;//count the number of notebooks
        do
        {
            counter1 = counter1 + 1;
            this.wait(2000);
        } while (casper.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter1 + ') > div:nth-child(1) > span:nth-child(1)'}));
        counter1 = counter1 - 1;
        this.echo("number of notebooks under Notebooks I Starred list:" + counter1);
        var flag = 0;//flag variable to test if the Notebook was found in the div
        var starcount = 0;//checking the starcount of the notebook under this div
        for (var i = 1; i <= counter1; i++) {
            this.wait(2000);
            var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
            //this.echo(temp);
            if (temp == title) {
                flag = 1;
                this.echo("Found notebook " + title + " in Notebooks I Starred list");
                starcount = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > sub:nth-child(2)'});
                break;
            }
        }//for closes
        if (flag == 1) {
            this.echo("Notebook with title " + title + " is PRESENT under Notebooks I Starred list with star count = " + starcount);
            this.echo("loaded the notebook " + title);
            this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
            this.wait(7000);
            this.test.assertDoesntExist({type: 'css', path: '.r-result-div'}, "Confirmed that mardown cell remained deleted after switching back to Notebook "+ title);
        }
        else {
            this.echo("Notebook with title " + title + " is ABSENT under Notebooks I Starred list");
        }
    });


    casper.run(function () {
        test.done();
    });
});
