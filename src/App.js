import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <label>Comments CSV:</label>
                <input type="file" id="file-selector-comments" />
                <label>Stories CSV:</label>
                <input type="file" id="file-selector-stories" />
                <label>Max comments per person:</label>
                <input type="text" id="max-comments-per-person" defaultValue="10" />
                <label>Each story counts for this many comments:</label>
                <input type="text" id="story-weight" defaultValue="1" />
                <label>Number of winners:</label>
                <input type="text" id="winners" defaultValue="2" />
                <button type="button" onClick={async function() {
                    log("Running")
                    var output = ""
                    var addOutput = s => {
                        output += s
                        output += "\n"
                    }
                    var comments = await getAsText(document.getElementById("file-selector-comments").files[0])
                    comments = comments.split(/\r?\n/)
                    var stories = await getAsText(document.getElementById("file-selector-stories").files[0])
                    stories = stories.split(/\r?\n/)
                    const maxComments = Number(document.getElementById("max-comments-per-person").value)
                    const multiplier = Number(document.getElementById("story-weight").value)
                    const winners = Number(document.getElementById("winners").value)

                    if (comments[0].toLowerCase().includes("comment")) {
                        addOutput(`Stripping ${comments[0]} header...`)
                        comments.shift()
                    }
                    addOutput(`Processing ${comments.length} comment rows...`)

                    if (stories[0].toLowerCase().includes("story") || stories[0].toLowerCase().includes("stories")) {
                        addOutput(`Stripping ${stories[0]} header...`)
                        stories.shift()
                    }
                    addOutput(`Processing ${stories.length} story rows...`)

                    var scores = {}

                    for (var i = 0; i < comments.length; i++) {
                        if (!(comments[i] in scores)) {
                            scores[comments[i]] = 1
                            continue
                        }

                        if (scores[comments[i]] >= maxComments) {
                            continue
                        }

                        scores[comments[i]]++
                    }

                    for (var i = 0; i < stories.length; i++) {
                        if (!(stories[i] in scores)) {
                            scores[stories[i]] = multiplier
                            continue
                        }

                        scores[stories[i]] += multiplier
                    }

                    console.log(Object.keys(scores))
                    addOutput(`${Object.keys(scores).length} unique entrants...`)

                    var weighted = []
                    for (var k in scores) {
                        for (var i = 0; i < scores[k]; i++) {
                            weighted.push(k)
                        }
                    }

                    addOutput(`${weighted.length} non-unique entries, after limiting to ${maxComments} comments and weighting stories at ${multiplier}...`)
                    addOutput("")
                    addOutput(`Shuffling and selecting ${winners} winners.`)

                    var shuffled = shuffle(weighted)
                    for (var i = 0; i < winners; i++) {
                        addOutput(`${i + 1} - ${shuffled[i]}`)
                    }
                    log(output)



                }}>Find winners</button>
                <p>
                <div id="output">
                    Waiting...
                </div>
                </p>
            </header>
        </div>
    );
}

function log(s) {
    document.getElementById("output").innerHTML = s.split("\n").join("<br/>")
}

function errorHandler(e) {
    document.getElementById("output").innerHTML = e.toString()
}

async function getAsText(file) {
    try {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        var getText = new Promise(r => {
            reader.onerror = errorHandler

            reader.onload = e => {
                r(e.target.result)
            }
        });
        return await getText
    } catch (e) {
        errorHandler(e)
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export default App;
