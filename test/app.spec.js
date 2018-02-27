var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var jsdom = require('jsdom');

var JSDOM = jsdom.JSDOM;
var VirtualConsole = jsdom.VirtualConsole;

var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe('App Spec', function() {
    var currentIndex=0;
    var Test1Index=0;
    var Test2Index=0;
    var Test1Value=getUID();
    var Test2Value=getUID();

    function getUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        });
    }

    describe('/todo/add', function() {
        it('should have the add ToDo item input', function(done) {
            chai.request(server)
                .get('/todo')
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    dom.window.document.getElementById('newtodo').name.should.be.a('string'); // confirming it exists
                    done();
                });
        });

        it('should be able to add ToDo item', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': Test1Value})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    currentIndex=dom.window.document.querySelectorAll(".toDovalue").length-1;
                    Test1Index=currentIndex;
                    dom.window.document.getElementById('span-todo-' + currentIndex).innerHTML.should.be.equal(Test1Value);
                    done();
                });
        });

        it('should be able to add a second ToDo item', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': Test2Value})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    currentIndex=dom.window.document.querySelectorAll(".toDovalue").length-1;
                    Test2Index=currentIndex;
                    dom.window.document.getElementById('span-todo-' + currentIndex).innerHTML.should.be.equal(Test2Value);
                    done();
                });
        });

        it('should not add a todo if ToDo item is empty', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': ''})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-' + currentIndex+1), null);
                    done();
                });
        });
    });

    describe('/todo/delete', function() {
        it('should be able to delete a ToDo item', function(done) {
            chai.request(server)
                .get('/todo/delete/' + Test1Index)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // confirm that the 2nd ToDo is now the first ToDo
                    dom.window.document.getElementById('span-todo-' + Test1Index).innerHTML.should.be.equal(Test2Value);
                    done();
                });
        });

        it('should not delete anything if ToDo ID is invalid', function(done) {

            chai.request(server)
                .get('/todo/delete/uip')
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    var currentCount=dom.window.document.querySelectorAll(".toDovalue").length;
                    expect(currentIndex).to.eql(currentCount); 
                    done();
                });
        });
    });

    describe('/todo/edit', function() {
        it('should be able to update a ToDo item', function(done) {
            Test3Value=getUID();
            chai.request(server)
                .post('/todo/edit/' + Test1Index)
                .type('form')
                .send({'edittodo': Test3Value})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // console.log(res.text);
                    dom.window.document.getElementById('span-todo-' + Test1Index).innerHTML.should.be.equal(Test3Value);
                    done();
                });
        });

        it('should not be able to edit a non-existant ToDo item', function(done) {
            chai.request(server)
                .post('/todo/edit/123')
                .type('form')
                .send({'edittodo': 'Updated123'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // console.log(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-123'), null);
                    done();
                });
        });

        it('should ignore string IDs for edit', function(done) {
            chai.request(server)
                .post('/todo/edit/dummy')
                .type('form')
                .send({'edittodo': 'UpdatedToDodummy'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // console.log(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-dummy'), null);
                    done();
                });
        });
    });

    describe('/unknownPage', function() {
        it('should send you to /todo', function(done) {
            chai.request(server)
                .get('/unknownPage')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.req.path.should.be.equal('/todo');
                    done();
                });
        });
    });

    describe('XSS attacks should not work', function() {
        it('should not allow XSS when adding a ToDo item', function(done) {
            var theScript = '<script>alert("you have been hacked")</script>';
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': theScript})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var virtualConsole = new VirtualConsole();
                    virtualConsole.on("jsdomError", function() { chai.assert.fail(Error, null, 'Error inJSDOM'); });
                    var dom = new JSDOM(res.text, { virtualConsole: virtualConsole, runScripts: "dangerously" });
                    var currentIndex=dom.window.document.querySelectorAll(".toDovalue").length-1;
                    dom.window.document.getElementById("span-todo-" +currentIndex).should.not.equal(theScript);
                    done();
                });
        });

        it('should not allow XSS when adding a ToDo item, 2nd test', function(done) {
            var theScript = '<script>window.onload = function() {document.getElementById("newtodo").value = "You got hacked!";document.getElementById("new-submit").click();};</script>';
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': theScript})
                .end(function(err, res) {
                    res.should.have.status(200);
                    // console.log(res.text);
                    var virtualConsole = new VirtualConsole();
                    virtualConsole.on("jsdomError", function() { chai.assert.fail(Error, null, 'Error in JSDOM'); });
                    var dom = new JSDOM(res.text, { virtualConsole: virtualConsole, runScripts: "dangerously" });
                    var currentIndex=dom.window.document.querySelectorAll(".toDovalue").length-1;
                    dom.window.document.getElementById("span-todo-" +currentIndex).should.not.equal(theScript);
                    done();
                });
        });
    });
});
