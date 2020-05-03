console.log("Ależ skomplikowany program!");

function zaloguj(...komunikaty: string[]) {
    console.log("Ależ skomplikowany program!", ...komunikaty);
}

zaloguj("Ja", "cię", "nie", "mogę");

let jsonString: string = `{
    "piloci": [
        "Pirx",
        "Exupery",
        "Idzikowski",
        "Główczewski"
    ],
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }
}`;

interface ILotnisko {
    [name: string]: [string, number[]];
}

type Pilot = string;

interface ILiniaLotnicza {
    piloci: [Pilot];
    lotniska: ILotnisko;
}

function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza {
    const pola : string[] = ["piloci", "lotniska"]

    const pardane = JSON.parse(dane);

    for(const i in pola) {
        if(i in pardane === false) {
            return false;
        }
    }

    console.log("ok");
    console.log(dataStructure.piloci.length);
    console.log(dataStructure.piloci.length);
    return true;
}

let dataStructure: ILiniaLotnicza = JSON.parse(jsonString);

console.log(dataStructure);

console.log(dataStructure.piloci.length);