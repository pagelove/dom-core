class Multipart {
    constructor(body, boundary) {
        this.body = body;
        this.boundary = boundary;
    }

    get parts() {        
        const bits = this.body.split(`--${this.boundary}\r\n`).map( p => p.trim() ).filter( part => part.trim().length > 0 && part.trim() !== '--' );
        bits[bits.length-1] = bits[bits.length-1].replace(new RegExp(`\r\n\r\n--${this.boundary}--$`), '');
        return bits.map( (part) => {
            const lines = part.trim().split('\r\n');
            const headerLines = [];
            for ( const line of lines ) {
                const headerParts = line.split(/:\s/);                
                headerLines.push( headerParts );
            }
            const headers = new Headers( headerLines );
            return headers;
        })
    }
}

export { Multipart };
