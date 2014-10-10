/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that The existence of commands present in a notebook is session dependent.
 After switching to another notebook and returning back , unless re-initialised, the variables would be inaccessible


 */

//Begin Tests

casper.test.begin("The commands present in a notebook ", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;//store Notebook title

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

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
    });

    //Added a new cell
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', "b<-45");
        this.wait(3000);
        this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//css for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    //Added a new cell
    functions.addnewcell(casper);

    //Add contents to the second cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", "b");
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'})
        this.wait(5000);
        this.echo("executed contents of second cell");

    });

    //Create another new Notebook.
    functions.create_notebook(casper);

    //getting count of notebooks
    var counter = 0;//get count of notebooks
    casper.then(function () {
        this.wait(5000);
        do
        {
            counter = counter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter + ') > div:nth-child(1) > span:nth-child(1)'}));
        counter = counter - 1;
        this.echo("total number of notebooks in Notebooks I Starred div:" + counter);

    });

    //switch back to previous notebook
    casper.then(function () {
        for (var i = 1; i <= counter; i++) {
            this.wait(2000);
            var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
            if (temp == title) {
                this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
                this.echo("Switched back to notebook  " + title);
                break;
            }
        }//for closes
        this.wait(7000);
    });

    //run the second cell
    casper.then(function () {
        this.click({type: "xpath", path: '/html/body/div[3]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'});
        this.wait(3000);
    });

    //Verify that Error message is shown
    casper.viewport(1366, 768).then(function () {
        this.test.assertTextExists('## Error: object ', 'confirmed that error was produced while trying to access the variable before executing it again');
    });

    casper.run(function () {
        test.done();
    });
});
