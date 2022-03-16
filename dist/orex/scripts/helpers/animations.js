
var XGSAP;
(function (XGSAP) {
    let Type;
    (function (Type) {
        Type["TO"] = "TO";
        Type["FROM"] = "FROM";
        Type["FROMTO"] = "FROMTO";
        Type["SET"] = "SET";
        Type["TIMELINE"] = "TIMELINE";
    })(Type = XGSAP.Type || (XGSAP.Type = {}));
})(XGSAP || (XGSAP = {}));
const XAnimVars = {
    rotateXPool: (config) => {
        config = {
            rotation: "+=360",
            duration: 10,
            ...config
        };
        return [
            {
                type: XGSAP.Type.TO,
                rotation: config.rotation,
                duration: config.duration,
                repeat: -1,
                ease: "none",
                callbackScope: config.xGroup,
                onUpdate() {
                    this.xItems.forEach((xItem) => {
                        if (xItem.xParent?.isInitialized) {
                            xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                        }
                    });
                }
            }
        ];
    },
    fadeDieText: (config) => {
        config = {
            duration: 0.15,
            ease: "power2.out",
            ...config
        };
        return [
            {
                type: XGSAP.Type.TO,
                color: "transparent",
                outlineWidth: 0,
                autoAlpha: 0,
                duration: config.duration,
                ease: config.ease
            }
        ];
    },
    pulseRolledDie: (config) => {
        config = {
            stagger: 0.15,
            duration: 1,
            ...config
        };
        return [
            {
                type: XGSAP.Type.TIMELINE,
                stagger: config.stagger
            },
            {
                type: XGSAP.Type.TO,
                timeStamp: ">",
                color: "black",
                outlineWidth: 0,
                outlineOffset: 0,
                autoAlpha: 0.5,
                duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
                ease: "power2.out"
            },
            {
                type: XGSAP.Type.TO,
                timeStamp: ">",
                scale: 1.5,
                duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
                ease: "back.inOut",
                repeat: 1,
                yoyo: true,
                yoyoEase: true
            },
            {
                type: XGSAP.Type.TO,
                timeStamp: ">",
                autoAlpha: 1,
                duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
                ease: config.ease
            }
        ];
    }
};
export default XAnimVars;
