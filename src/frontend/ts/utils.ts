import { Device, Types } from "./device.js";

export const requestHandler = (
    method: string,
    path: string,
    callback: (data: string) => void,
    body?: Object
) => {
    let request = new XMLHttpRequest()

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {
                let res = request.responseText;
                callback(res)
            }

        }
    }
    request.open(method, `http://localhost:8000${path}`, true)

    if (body) {
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(body))
    } else {
        request.send();
    }
}

export const deviceTemplate = (devices: Device[], target: HTMLElement): HTMLElement => {

    const items: string[] = []

    for (let device of devices) {

        let icon = ''
        switch (device.type) {
            case Types.AC:
            case Types.FAN:
                icon = 'ac_unit'
                break;
            case Types.LIGHT:
                icon = 'lightbulb_outline'
                break;
            case Types.MUSIC:
                icon = 'music_note'
                break;
            case Types.TV:
                icon = 'tv'
                break;
            default:
                icon = 'power'
                break;
        }

        let template = `
        <div class="col s12 m6 l4 xl3">
            <div class="device">
                <i class="small material-icons white-icon">${icon}</i>
                <h2>${device.name}</h2>
                <p>${device.description}</p>
                <div class="switch">
                    <label class="white-text">
                    Off
                    <input type="checkbox" id="cb_${device.id}" ${device.state === 1 && 'checked'}>
                    <span class="lever"></span>
                    On
                    </label>
                </div>
                <div class="buttonsContainer">
                    <a class="waves-effect waves-teal btn-flat white-text modal-trigger" href="#modal2" id="edit_${device.id}">Editar</a>
                    <a class="waves-effect waves-teal btn-flat white-text" id="del_${device.id}">Eliminar</a>
                </div>
            </div>
        </div>
        `
        items.push(template)
    }

    target.innerHTML = items.join('')


    return target
}