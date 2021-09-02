function EarnButton(name, x, y, color, region) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.region = region;
}

var GEMS_BUTTON = new EarnButton("gems", 2302, 169, "#194a6f", [2187, 145, 235, 32]);
var COINS_BUTTON = new EarnButton("coins", 2628, 169, "#efa91e", [2513, 169, 235, 32]);

auto();
setScreenMetrics(device.width, device.height);

var window = floaty.window(
    <frame gravity="center">
        <text id="text" text="" textSize="16sp" textColor="#f44336" />
    </frame>
);
window.setPosition(1150, 115);
sleep(20);

toast("START");
device.vibrate(50);

// Click automatically to grant screenshot permission
threads.start(function () {
    // Code executed in a new thread
    sleep(500);
    click(1013, 2860);
});

if (!images.requestScreenCapture(true)) {
    toast("Capture Failed.")
    exit();
}

threads.shutDownAll();

app.launchApp("Plants Vs Zombies 2");
sleep(2000);    // Wait for the game to launch

var notFoundTimes = 0;

while (true) {
    var img = images.captureScreen();

    // Find gems first
    var hasFoundGems = findColor(img, GEMS_BUTTON.color, {
        region: GEMS_BUTTON.region,
        threshold: 4
    });

    if (hasFoundGems) {
        notFoundTimes = 0;
        watchAdAuto(GEMS_BUTTON);
    } else {
        // If gems cannot be found, find coins
        var hasFoundCoins = findColor(img, COINS_BUTTON.color, {
            region: COINS_BUTTON.region,
            threshold: 4
        });

        if (hasFoundCoins) {
            notFoundTimes = 0;
            watchAdAuto(COINS_BUTTON);
        } else {
            notFoundTimes++;
            printFlt("Not Found. " + notFoundTimes + "/60");
            // Keep finding for about 1 minute
            if (notFoundTimes >= 60)
                break;
            else
                sleep(1000);
        }
    }
}

device.vibrate(50);
toast("FINISH");

// A series of automatic click actions to watch the ad
function watchAdAuto(button) {
    printFlt("Found " + button.name + ".");
    click(button.x, button.y);  // EARN
    sleep(100);
    click(1903, 860);   // YES
    sleep(2000);
    click(228, 1329);   // mute
    sleep(30500);       // wait for the ad ends
    click(2964, 84);    // close ad
    sleep(2100);
    click(1625, 1167);  // CONTINUE
    sleep(2000);
}

// Show status in the floating window
function printFlt(str) {
    // Operations on the controls need to be executed in the UI thread
    ui.run(function () {
        window.text.setText(str);
    });
}


