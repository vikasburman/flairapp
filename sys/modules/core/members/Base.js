define(() => {
    /**
     * @class sys.core.Base
     * @classdesc sys.core.Base
     * @desc Base class for all classes.
     */
    return Class('sys.core.Base', function(attr) {
        this.func('constructor', this.noop);

        attr('protected');
        this.prop('env', config.env);

        let _assembly = '';
        attr('readonly');
        attr('protected');
        this.prop('assembly', () => {
            if (!_assembly) { 
                let parts = this._.name.split('.');
                if (parts.length > 1) {
                    _assembly = parts[0] + '.' + parts[1];
                }
            }
            return _assembly;
        });

        attr('protected');
        this.func('settings', (key, defaultValue = null) => {
            if (key.indexOf(':') !== -1) {
                return settings(key, defaultValue);
            } else if (this.assembly === '') {
                throw `assembly must be defined.`;
            } else {
                return settings(this.assembly + ':' + key, defaultValue);
            }
        });

        attr('protected');
        this.func('onError', (err) => {
            console.log(`Error in ${this._.name} (${err.toString()})`); 
            if (!config.env.isProd) { 
                console.log(`${err}`);
            }
        });

        attr('protected');
        this.func('errorText', (err, list) => {
            let errCode = 'default',
                errText = `Unknown error. (${err})`;
            if (err) {
                if (typeof err === 'string' || typeof err === 'number') { // just any error code
                    errCode = err.toString();
                } else if (err.code) { // ErrorInfo object
                    errCode = err.code;
                } else if (err.error) { // ClientResponse object
                    if (err.error.code) { // ErrorInfo object inside clientResponse object
                        errCode = err.error.code;
                    } else {
                        errCode = err.error;
                    }
                }
            }
            if (list) {
                if (list[errCode]) {
                    errText = list[errCode];
                } else if (errCode !== 'default' && list['default']) {
                     errText = list['default'];
                }
            }
            return errText;
        });
    });
});