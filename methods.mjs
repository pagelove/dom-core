
const rawMethod = async (method, bodyBuilder) => {
    try {
        const url = this.baseURI || window.location.href;
        const request = new Request(url);
        request.headers.set("Range", `selector=${this.selector}`);

        const opts = { headers, method };
        if ( requestBuilder ) {
            requestBuilder.call( this, request );
            opts.body = body;
        }

        const response = await fetch( url, opts );

        if (!response.ok) throw new Error({ response });

        return response;
    } catch(e) {
        console.error(`dom-core error: ${method} request failed: ${e.response.statusText}`);
        const errorEvent = new CustomEvent("DOMCore", {
            bubbles: true,
            detail: { element: this, error, method },
        });
        this.dispatchEvent(errorEvent);        
    }
};

const DELETE = async() => {
    return rawMethod.call( this, 'DELETE' );
}

const POST = async( postData ) => {
    return rawMethod.call( this, 'POST', () => {
        const htmlContent = serializeContent(postData).trim();
    });
}

const PUT = async( putData ) => {
}

const GET = async() => {
}

export { PUT, POST, GET, DELETE }