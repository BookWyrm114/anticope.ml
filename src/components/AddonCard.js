import React, { useState, useRef, useEffect } from "react";
import Button from './Button'
import Tooltiped from './Tooltiped'

import { 
    FaWindowMinimize, 
    FaCode, 
    FaCheck, 
    FaArchive,
    FaBiohazard,
    FaDiscord, 
    FaLink,
    FaGithub
} from "react-icons/fa";
import './AddonCard.css';

const UNKNOWN_ICON = "https://anticope.ml/resources/unknown_icon.png"

function formatStrings(strings) {
    if (strings.length === 0) return "";
    else if (strings.length === 1) return strings[0]
    else if (strings.length === 2) return `${strings[0]} and ${strings[1]}`
    else return `${strings.slice(0, -1).join(', ')} and ${strings[strings.length - 1]}`
}

function getIcon(type) {
    switch (type) {
        case "discord": return <FaDiscord />
        default: return <FaLink />
    }
}

function AddonCard({ addon }) {
    const [active, setActive] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setActive(false)
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [setActive]);

    if (!addon || addon == undefined || typeof addon !== "object" || addon.id == undefined) return <></>

    try {
        return <div className={"AddonCard appear" + (active ? " active" : " inactive")} ref={ref}>
            {active &&
                <button className="Close" onClick={() => { setActive(false) }}>
                    <FaWindowMinimize />
                </button>
            }
            <div className="Line">
                <img src={addon.icon || UNKNOWN_ICON} alt="icon" className="Icon" />
                <div className="Col">
                    <h3>{addon.name}</h3>
                    {(addon.authors && addon.authors.length > 0) &&
                        <span> by {formatStrings(addon.authors)}</span>
                    }
                </div>
            </div>
            <div className="Line">
                {!addon.verified &&
                    <div className="Status">
                        <Tooltiped tooltip="Unverified addon. May contain malware. Proceed with caution!">
                            <FaBiohazard color="#BF616A" />
                        </Tooltiped>
                    </div>
                }
                {addon.status.devbuild &&
                    <div className="Status">
                        <Tooltiped tooltip="Addon is avaliable for the latest devbuild of Meteor Client">
                            <FaCode color="#A3BE8C" />
                        </Tooltiped>
                    </div>
                }
                {addon.status.release &&
                    <div className="Status">
                        <Tooltiped tooltip="Addon is avaliable for the latest release of Meteor Client">
                            <FaCheck color="#A3BE8C" />
                        </Tooltiped>
                    </div>
                }
                {addon.status.archived &&
                    <div className="Status">
                        <Tooltiped tooltip="Addon is archived and read only">
                            <FaArchive color="#BF616A" />
                        </Tooltiped>
                    </div>
                }
            </div>
            <p>
                {addon.summary || ""}
            </p>
            {active &&
                <div className="Line appear">
                    <a href={addon.links.github}>
                        <Button>
                            <FaGithub style={{marginRight: '0.6rem'}}/>
                            Repository
                        </Button>
                    </a>
                    <div className="IconLinks">
                        {Object.keys(addon.links).map((key) => {
                            if (key === "github") return <></>
                            else {
                                return <Tooltiped key={key} tooltip={key}>
                                    <a href={addon.links[key]}>{getIcon(key)}</a>
                                </Tooltiped>
                            }
                        })}
                    </div>
                </div>
            }
            {!active &&
                <div className="bottom">
                    <Button onClick={() => { setActive(true) }}>More</Button>
                </div>
            }
        </div>
    } catch { // this is how i check for errors in json :troll:
        return <></>
    }

}

export default AddonCard;