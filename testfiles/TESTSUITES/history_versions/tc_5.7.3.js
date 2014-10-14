/* 
 Author: Arko
 Description:    This is a casperjs automated test script to load a previous version of the selected notebook. On selecting the option
 for 'Revert' present on the top-left corner of the page, the respective version of the notebook gets saved as the current version of
 that particular notebook. A way to verify it can be to check that notebook is no more in read only mode


 */

//Begin Tests

casper.test.begin(" Revert  to a particular History Version", 11, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;
	var input_code = "a<-50+50\n a";
    var expectedresult = "100\n"

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

    //Create new R cell and execute some code in it
    functions.addnewcell(casper);
    functions.addcontentstocell(casper,input_code);
    
    //fetch the output text and compare
    casper.then(function () {
        var result = this.fetchText({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div/div[3]/div[2]/pre[2]/code'});//fetch the output after execution
        var res = result.substring(7);//remove the unwanted characters
        this.echo("The output of the R code is: " + res);
        this.test.assertEquals(res, expectedresult, "The R code has produced the expected output");

    });

    //checking if history links are present for the notebook
    casper.then(function () {
        var counter1 = 0;//count the number of notebooks
        do
        {
            counter1 = counter1 + 1;
            this.wait(2000);
        } while (casper.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter1 + ') > div:nth-child(1) > span:nth-child(1)'}));
        counter1 = counter1 - 1;
        var flag = 0;//flag variable to test if the Notebook was found in the div
        for (var i = 1; i <= counter1; i++) {
            this.wait(2000);
            var temp = this.fetchText({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'});
            if (temp == title) {
                flag = 1;
                this.test.assertTruthy(this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > i:nth-child(1)'}), "History icon for the notebook has been clicked");
                break;
            }
        }//for closes
        this.wait(4000);
        this.test.assertExists({type: 'css', path: '.jqtree-selected > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, 'history links present');
        //clicking on the history link
        this.echo('Loading the history version for notebook ' + title);
        this.test.assertTruthy(this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}), 'History version successfully loaded');
        this.wait(6000);
    });

    //reverting back to the loaded history version
    casper.then(function () {
        this.test.assertExists({type: 'css', path: '.icon-undo'}, "Revert option for history link exists");
        var z = casper.evaluate(function () {
            $('.icon-undo').click();
        });
        this.echo('Revert option has been clicked');
        this.wait(4000);
    });

    //verify that the history version has been reverted back to successfully
    casper.then(function () {
        this.wait(10000);
        this.test.assertNotVisible({type: 'css', path: '#revert-notebook'}, "Revert option no longer exists,hence the notebook has reverted back to the history version");
        this.test.assertNotVisible({type: 'css', path: '#readonly-notebook'}, "The history version is in no longer in read-only state");
    });

    casper.run(function () {
        test.done();
    });
});
