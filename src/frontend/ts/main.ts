import { Device } from "./device.js";
import { deviceTemplate, requestHandler } from "./utils.js";

declare var M: any;
class Main implements EventListenerObject {
    public devices: Array<Device> = new Array<Device>();

    //Gets devices from the DB
    public getDevices() {

        const handleRes = (res: string) => {
            let items: Device[] = JSON.parse(res)
            let target = document.getElementById('lista')
            target = deviceTemplate(items, target)

            //Attatch listeners to each devices buttons
            for (let item of items) {
                let checkbox = document.getElementById('cb_' + item.id);
                checkbox.addEventListener('click', this)

                let delButton = document.getElementById('del_' + item.id);
                delButton.addEventListener('click', this)

                let editButton = document.getElementById('edit_' + item.id);
                editButton.addEventListener('click', this)

            }
        }

        return requestHandler('GET', '/devices', handleRes)
    }

    //Add a new device
    private addDevice() {
        //Form values
        const iName = <HTMLInputElement>document.getElementById("iName");
        const iDescription = <HTMLInputElement>document.getElementById("iDescription");
        const iType = <HTMLInputElement>document.getElementById("iType");

        //Device starts off by default
        const state = 0;

        if (iName.value && iDescription.value && iType.value) {
            const body = {
                name: iName.value,
                description: iDescription.value,
                type: parseInt(iType.value),
                state: state
            }
            requestHandler('POST', '/device', () => this.getDevices(), body)
        } else {
            console.log('Missing fields')
        }
    }

    //Delete selected device
    private deleteDevice(id: string) {
        requestHandler('DELETE', `/device/${id}`, () => this.getDevices())
    }

    //Switch device state
    private changeState(id: string) {

        //change device state and update it
        const callback = (res: string) => {
            const device: Device = JSON.parse(res)[0]
            if (device.state === 0) {
                device.state = 1
            } else {
                device.state = 0
            }
            requestHandler('PUT', `/device/${id}`, () => this.getDevices(), device)
        }

        //Get device information, the update the state
        requestHandler('GET', `/devices/${id}`, callback)
    }

    //Get device information and load it in the form
    private loadModalValues(id: string) {

        //Target form fields
        const iName = <HTMLInputElement>document.getElementById("iEditName");
        const iDescription = <HTMLInputElement>document.getElementById("iEditDescription");
        const iType = <HTMLSelectElement>document.getElementById("iEditType");
        const editButton = <HTMLSelectElement>document.getElementById("btnEdit");

        //change device state and update it
        const callback = (res: string) => {
            const device: Device = JSON.parse(res)[0]

            iName.value = device.name
            iDescription.value = device.description
            iType.value = device.type.toString()
            editButton.id = `btnEdit_${device.id}`

            //Select type value
            for (let i = 0; i < iType.options.length; i++) {
                if (iType.options[i].value === iType.value) {
                    iType.selectedIndex = i;
                    iType.options[i].selected = true;
                    break; // Once found, exit the loop
                }
            }

        }
        //Get device information, then load the modal with its current info.
        requestHandler('GET', `/devices/${id}`, callback)
    }

    //Edit the device fields
    private editDevice(id: string) {

        //Target form fields
        const iName = <HTMLInputElement>document.getElementById("iEditName");
        const iDescription = <HTMLInputElement>document.getElementById("iEditDescription");
        const iType = <HTMLSelectElement>document.getElementById("iEditType");
        const editButton = <HTMLSelectElement>document.getElementById(`btnEdit_${id}`);

        //change device state and update it
        const callback = (res: string) => {
            const device: Device = JSON.parse(res)[0]

            const body = {
                name: iName.value,
                description: iDescription.value,
                type: parseInt(iType.value),
                state: device.state
            }
            //If the request was successful refresh devices list and edit button id
            const after = () => {
                this.getDevices()
                editButton.id = 'btnEdit'
            }

            requestHandler('PUT', `/device/${id}`, after, body)

        }

        //Get device information, the update the information
        requestHandler('GET', `/devices/${id}`, callback)
    }

    handleEvent(object: Event): void {
        //Target clicked element
        let elemento = <HTMLElement>object.target;

        if ("btnGuardar" === elemento.id) {
            //ADD DEVICE
            this.addDevice();
        } else if (elemento.id.startsWith('del_')) {
            //DELETE DEVICE
            const target_id = elemento.id.substring(4, elemento.id.length)
            this.deleteDevice(target_id)
        } else if (elemento.id.startsWith('cb_')) {
            //SWITCH STATE
            const target_id = elemento.id.substring(3, elemento.id.length)
            this.changeState(target_id)
        } else if (elemento.id.startsWith('edit_')) {
            //OPEN EDIT MODAL
            const target_id = elemento.id.substring(5, elemento.id.length)
            this.loadModalValues(target_id)
        } else if (elemento.id.startsWith('btnEdit_')) {
            //EDIT DEVICE
            const target_id = elemento.id.substring(8, elemento.id.length)
            this.editDevice(target_id)
        }

    }

}


window.addEventListener("load", () => {

    //Init materialize components
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, "");

    //Load devices on start
    let main1: Main = new Main();
    main1.getDevices()

    //Attatch event listeners to required elements
    let botonGuardar = document.getElementById("btnGuardar");
    botonGuardar.addEventListener("click", main1);

    let botonEditar = document.getElementById("btnEdit");
    botonEditar.addEventListener("click", main1);

});

