const constants = require("./constants");
const dispatcher = require("./dispatcher");
const joystick = require("./joystick");
const buttons = require("./buttons");
const builder = require("./builder");
const props = builder.props;

exports.loadGame = path => {
  
  $ui.push({
    props: {
      title: path.split(".").slice(0, -1).join("."),
      clipsToSafeArea: true,
      homeIndicatorHidden: true
    },
    views: [
      {
        type: "view",
        props: {
          id: "container"
        },
        layout: $layout.fill,
        views: [
          {
            type: "web",
            props: {
              id: "console",
              url: "http://localhost:1010/index.html",
              scrollEnabled: false,
              showsProgress: false
            },
            events: {
              didFinish: sender => {
                sender.eval({"script": `initGame('./roms/${path}')`});
              }
            }
          }
        ],
        events: {
          layoutSubviews: sender => {
            let view = $("console");
            let frame = sender.frame;
            if (frame.width > frame.height) {
              let height = frame.height;
              let width = Math.floor(height * 256 / 240);
              view.frame = $rect((frame.width - width) / 2, (frame.height - height) / 2, width, height);
            } else {
              let width = frame.width;
              let height = Math.floor(width * 240 / 256);
              view.frame = $rect((frame.width - width) / 2, constants.btnSize.startSelect.height + constants.btnMargin * 2, width, height);
            }
          }
        }
      },
      {
        type: "runtime",
        props: {
          id: "joystick",
          view: (() => {
            joystick.$removeAllSubviews();
            return joystick;
          })()
        },
        layout: (make, view) => {
          make.left.equalTo(constants.btnMargin);
          make.bottom.inset(constants.bottomInset);
          let width = (constants.btnSize.leftRight.width * 2 + constants.btnSize.upDown.width);
          make.size.equalTo($size(width, width));
        },
        views: [
          {
            type: "label",
            props: props.blackBtn("L", "←"),
            layout: (make, view) => {
              make.left.equalTo(0);
              make.centerY.equalTo(view.super);
              make.size.equalTo(constants.btnSize.leftRight);
            }
          },
          {
            type: "label",
            props: props.blackBtn("R", "→"),
            layout: (make, view) => {
              make.right.equalTo(0);
              make.centerY.equalTo(view.super);
              make.size.equalTo(constants.btnSize.leftRight);
            }
          },
          {
            type: "label",
            props: props.blackBtn("U", "↑"),
            layout: (make, view) => {
              make.top.equalTo(0);
              make.centerX.equalTo(view.super);
              make.size.equalTo(constants.btnSize.upDown);
            }
          },
          {
            type: "label",
            props: props.blackBtn("D", "↓"),
            layout: (make, view) => {
              make.bottom.equalTo(0);
              make.centerX.equalTo(view.super);
              make.size.equalTo(constants.btnSize.upDown);
            }
          },
          {
            type: "label",
            props: props.grayBtn("LU", "↖"),
            layout: (make, view) => {
              make.top.left.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "label",
            props: props.grayBtn("RU", "↗"),
            layout: (make, view) => {
              make.top.right.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "label",
            props: props.grayBtn("LD", "↙"),
            layout: (make, view) => {
              make.left.bottom.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "label",
            props: props.grayBtn("RD", "↘"),
            layout: (make, view) => {
              make.right.bottom.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          }
        ]
      },
      {
        type: "runtime",
        props: {
          id: "buttons",
          view: (() => {
            buttons.$removeAllSubviews();
            return buttons;
          })()
        },
        layout: (make, view) => {
          make.right.inset(constants.btnMargin);
          make.bottom.inset(constants.bottomInset);
          let width = constants.btnSize.ab.width * 2 + constants.btnMargin;
          make.size.equalTo($size(width, width));
        },
        views: [
          {
            type: "label",
            props: props.redButton("B", "B"),
            layout: (make, view) => {
              make.left.bottom.equalTo(0);
              make.size.equalTo(constants.btnSize.ab.height);
            }
          },
          {
            type: "label",
            props: props.redButton("A", "A"),
            layout: (make, view) => {
              make.right.bottom.equalTo(0);
              make.size.equalTo(constants.btnSize.ab.height);
            }
          },
          {
            type: "label",
            props: props.redButton("BA", "B + A"),
            layout: (make, view) => {
              make.left.top.right.equalTo(0);
              make.height.equalTo(constants.btnSize.ab.height);
            }
          }
        ]
      },
      {
        type: "view",
        layout: (make, view) => {
          make.top.right.inset(constants.btnMargin);
          make.size.equalTo($size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height));
        },
        views: [
          {
            type: "button",
            props: props.functionBtn("SELECT", "SELECT"),
            layout: (make, view) => {
              make.left.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          },
          {
            type: "button",
            props: props.functionBtn("START", "START"),
            layout: (make, view) => {
              make.right.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          }
        ]
      }
    ]
  });
  
  ["SELECT", "START"].forEach(id => {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(dispatcher, "touchDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(dispatcher, "touchUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  });
}