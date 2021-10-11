

const canvasWidth = 500;

const savedConfigName = "canvasConfig";
const jsonFileName = "ImageConfig.json";

const html = `<h1>Simple Example</h1>
<form action="#">
        <fieldset class="toolArea">
            <label for="fileSelector">Select an Image file</label>
            <input type="file" id="fileSelector" />
            <fieldset>
                <b>Tools</b>
                </br>
                <button id="moveBtn">Move with Cursor</button>
                <button id="resizeBtn">Re-Size with Cursor</button>
                </br>
                <span>---------------------------------------------------------</span></br>
                <label>
                Manual Control
                </label>
                <input type="number" id="changeTxt" value="1" />
                </br>
                <button id="leftBtn">Move Left</button>
                <button id="rightBtn">Move Right</button>
                <button id="upBtn">Move Up</button>
                <button id="downBtn">Move Down</button>
                </br>
                <button id="scaleUp">Scale Up</button>
                <button id="scaleDown">Scale Down</button>
                
            </fieldset>
            <fieldset>
                <b>Save/Import</b></br>
                <button id="submitBtn">Submit</button>
                <button id="importBtn">Import</button>
                </br>
                <span>---------------------------------------------------------</span></br>
                <button id="downloadBtn">Download Config</button>
                <label for="uploader">Import config</label>
                <input type="file" id="configUploader" />
            </fieldset>
            <label id="info">-</label>
        </fieldset>
</form>

    <canvas id="editorCanvas"></canvas>`;



module.exports = { canvasWidth , html , savedConfigName , jsonFileName};