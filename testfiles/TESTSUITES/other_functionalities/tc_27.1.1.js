/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that the existing cells are renamed in GitHub immediately after the user
 clicks on insert cell
 */

//Begin Tests

casper.test.begin("Inserting a new cell in between", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;//store Notebook title
    var cellname;//store the initial cell name
    var githuburl;//store the github url of notebook

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
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', "45");
        this.wait(3000);
        this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//css for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    //Added another new cell
    functions.addnewcell(casper);

    //Add contents to the second cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys("div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > textarea:nth-child(1)", "65");
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div[2]/div/div/table/td/span/i'});
        this.wait(5000);
        this.echo("executed contents of second cell");

    });

    //getting Notebook ID
    var notebookid;
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
        githuburl = "https://gist.github.com/" + github_username + "/" + notebookid;
    });

    //open the notebook in Github 
    casper.then(function () {
        //githuburl = "https://gist.github.com/"+ github_username + "/" + notebookid;
        casper.thenOpen(githuburl, function () {
            this.wait(5000);
            this.echo("Opened the Notebook gist in Github");
            cellname = this.fetchText({type: 'xpath', path: '/html/body/div/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/div/div/a/strong'});

        });
    });

    //getting back to edit.html page and add a new cell
    casper.viewport(1366, 768).thenOpen(rcloud_url, function () {
        this.wait(10000);
        this.echo("Opened the Notebook under edit.html");
        casper.then(function () {
            this.click(x("/html/body/div[3]/div/div[2]/div/div/div[2]/div[2]/span[2]/i"));
            this.echo("Added a new cell");
        });
    });

    //open the notebook in Github again and verify that the cell name has changed
    casper.then(function () {
        casper.thenOpen(githuburl, function () {
            this.wait(9000);
            this.echo("Opened the Notebook gist in Github");
            var changedcellname = this.fetchText({type: 'xpath', path: '/html/body/div/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/div/div/a/strong'});
            this.test.assertNotEquals(cellname, changedcellname, "Confirmed that the cell name gets changed in the notebook gist on inserting a cell in between");
        });
    });

    casper.run(function () {
        test.done();
    });
});

