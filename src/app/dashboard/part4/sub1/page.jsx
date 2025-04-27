import React from 'react';

export default function EmbeddedPage() {
    const url = 'http://disgraphui.xning.site:5380';
    return (
        <div>
            <iframe
                src={url}
                width="100%"
                height="900px"
                title="Embedded Page"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms"
                allow="same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
            ></iframe>
        </div>
    );
};

