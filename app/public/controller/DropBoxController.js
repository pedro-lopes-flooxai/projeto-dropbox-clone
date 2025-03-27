class DropBoxController{
    
    constructor(){

        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');

        this.initEvents();


    }

    initEvents(){

        this.btnSendFileEl.addEventListener('click', event=>{

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event =>{

            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = '';

        });

    }

    modalShow(show = true){

        this.snackModalEl.style.display = (show) ? 'block' : 'none';
    }


    uploadTask(files){

        let promises = [];

        [...files].forEach(file=>{
            
            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event =>{

                    this.modalShow(false);

                        try {
                            resolve(JSON.parse(ajax.responseText));
                        }catch (e){

                            reject(e);

                        }

                };

                ajax.onerror = event =>{

                    this.modalShow(false);
                    reject(event);
                };

                ajax.onprogress = event =>{

                    this.uploadProgress(event, file);
            
                };

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();

                ajax.send(formData);

        }));

        });

        Promise.all(promises);
    }

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let.timeleft = ((100 - porcent) * timespent) / porcent;

        this.progressBarEl.style.width = `${porcent}%`;

        this.namefileEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman;
    }

    formatTimeToHuman(duration){

        let segunds = parseInt((duration / 1000)) % 60;
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos, ${seconds} segundos`;
        }
    
        if (minutes > 0) {
            return `${minutes} horas, ${seconds}`;
        }

        if (segunds > 0) {
            return `${seconds} segundos`
        }
        
        return '';
    }

    

}