import { PUT, POST, DELETE } from "/dom-core/methods.mjs";
import { Multipart } from '/dom-core/multipart.mjs';

const can = {
    'GET': new Set(),
    'POST': new Set(),
    'PUT': new Set(),
    'DELETE': new Set(),
};

function handleOption( selector, methods ) {
    if ( allowed.includes('PUT') ) {
        document.querySelectorAll(selector).forEach( ( element ) => {
            element.setAttribute('contenteditable', 'plaintext-only');
            if (Object.hasOwn(element, 'PUT')) return;
            Object.defineProperty(element, "PUT", {
                value: PUT,
            });
        });
    }
    if ( allowed.includes('POST') ) {
        document.querySelectorAll(selector).forEach( ( element ) => {
            if (Object.hasOwn(element, 'POST')) return;
            Object.defineProperty(element, "POST", {
                value: POST,
            });
        });                  
    }
    if ( allowed.includes('DELETE') ) {                            
        const handler = ( element ) => {
            if (Object.hasOwn(element, 'DELETE')) return;
            HTTPCan.DELETE.push( selector );
            Object.defineProperty(element, "DELETE", {
                value: DELETE,
            });                        
            element.addEventListener('command', async ( event ) => {
                if ( event.command === '--delete' ) {
                    await event.target.DELETE();
                }
            }, { once: true });                        
        };
    }
}

Object.defineProperty(document, 'OPTIONS', {
    value: async function() {
        const response = await fetch(window.location.href, {
            method: 'OPTIONS',
            headers: {
                'Prefer': 'return=representation',
                'Accept': 'multipart/mixed'
            }
        });
        if ( response.ok ) {
            if ( response.headers.get('content-type') ) {
                const ctheader = response.headers.get('content-type');
                const boundary = response.headers.get('content-type').match(/boundary=(.+)$/);
                const body = await response.text();

                const mpbody = new Multipart( body, boundary[1] );
            
                for ( const part of mpbody.parts ) {
                    if ( part.has('content-range')) {
                        const selector = part.get('content-range').match(/selector=(.+)$/)[1];
                        const allowed = part.get('Allow').split(',').map( m => m.trim() );
                        allowed.forEach( method => {
                            can[method].add( selector );
                        });                
                        processOptionsPart(selector, allowed);
                    }
                }
            } else {
                processOptionsPart(selector, response.get('Allow').split(',').map( m => m.trim() ) );
            }
        }       
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await document.OPTIONS();
});
