"use strict";
var test = require("tape"),
    handbrake = require("../lib/handbrake"),
    mock_cp = require("./mock/child_process");

handbrake._inject(mock_cp);

test("HandbrakeProcess, progress event: encoding (short)", function(t){
    t.plan(1);
    var handbrakeProcess = handbrake.spawn({ input: "blah", output: "blah" });
    handbrakeProcess.on("progress", function(progress){
        t.deepEqual(progress, {
            taskNumber: 1,
            taskCount: 1,
            percentComplete: 1.23,
            fps: null,
            avgFps: null,
            eta: null,
            task: "Encoding"
        });
    });

    mock_cp.lastHandle.stdout.emit("data", "\rEncoding: task 1 of 1, 1.23 %");
});

test("HandbrakeProcess, progress event: encoding (long)", function(t){
    t.plan(1);
    var handbrakeProcess = handbrake.spawn({ input: "blah", output: "blah" });
    handbrakeProcess.on("progress", function(progress){
        t.deepEqual(progress, {
            taskNumber: 1,
            taskCount: 1,
            percentComplete: 45.46,
            fps: 105.33,
            avgFps: 106.58,
            eta: "00h00m05s",
            task: "Encoding"
        });
    });

    mock_cp.lastHandle.stdout.emit("data", "\rEncoding: task 1 of 1, 45.46 % (105.33 fps, avg 106.58 fps, ETA 00h00m05s)");
});

test("HandbrakeProcess, progress event: muxing", function(t){
    t.plan(1);
    var handbrakeProcess = handbrake.spawn({ input: "blah", output: "blah" });
    handbrakeProcess.on("progress", function(progress){
        t.deepEqual(progress, {
            taskNumber: null,
            taskCount: null,
            percentComplete: null,
            fps: null,
            avgFps: null,
            eta: null,
            task: "Muxing"
        });
    });

    mock_cp.lastHandle.stdout.emit("data", "\rMuxing: this may take awhile...");
});
