/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that the total number of comments can be checked at any instant can be checked
 by getting the count from "<number of comments> Comments" text area


 */

//Begin Tests


casper.test.begin(" Total number of comments", 9, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var title;//get notebook title
    var functions = require(fs.absolute('basicfunctions'));
    var comment = "First comment";//the comment to be entered

    casper.start(rcloud_url, function () {
        casper.page.injectJs('/home/arko/Downloads/SLIMER-CASPER/casperjs/jquery-1.10.2.js');
    });

    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);
    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //verify that when no comments are made, the count is zero
    casper.then(function () {
        var comment_count = this.fetchText({type: 'css', path: '#comment-count'});
        this.test.assertEquals(comment_count, '0', 'no comments have been entered.Hence count of comments is zero');
    });

    //enter 1st comment and verify increase in count
    functions.comments(casper, comment);
    casper.then(function () {
        var comment_count = this.fetchText({type: 'css', path: '#comment-count'});
        this.test.assertEquals(comment_count, '1', 'New comment has been entered');
        this.echo("total comments at this instant= " + comment_count);
    });

    //enter 2nd comment and verify increase in count
    functions.comments(casper, comment);
    casper.then(function () {
        var comment_count = this.fetchText({type: 'css', path: '#comment-count'});
        this.test.assertEquals(comment_count, '2', 'New comment has been entered');
        this.echo("total comments at this instant= " + comment_count);
    });

    functions.delete_notebooksIstarred(casper);
    casper.run(function () {
        test.done();
    });
});
