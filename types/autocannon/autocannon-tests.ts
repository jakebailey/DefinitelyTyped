import autocannon = require("autocannon");

autocannon({
    url: "http://localhost:3000",
    title: "test",
    duration: "30s",
    method: "POST",
    pipelining: 1,
    idReplacement: true,
    forever: true,
    connections: 100,
    timeout: 30,
    excludeErrorStats: true,
    body: "ok",
    headers: { "accept-language": "en-US" },
    workers: 4,
    debug: true,
    setupClient: client => {
        client.setHeaders({ "content-type": "application/json" });
        client.setBody(Buffer.from("ok"));

        client.setRequest({
            body: "ok",
            headers: { "content-type": "text/html" },
            method: "PATCH",
            path: "/foo",
        });

        client.setRequests([
            {
                body: "ok",
                headers: { "content-type": "text/html" },
                method: "PATCH",
                path: "/foo",
            },
        ]);

        client.on("body", body => console.log(body.byteLength));
        client.on("headers", headers => console.log(headers.authorization));
        client.on("response", (statusCode, resBytes, responseTime) => {
            console.log(statusCode.toFixed(), resBytes.toFixed(), responseTime.toFixed());
        });
    },
}).then(result => {
    console.log(result.start, result.finish);
    console.log(result.latency.mean);
    console.log(result.non2xx);
    console.log(autocannon.printResult(result));
});

const instance = autocannon({ url: "http://localhost:3000" }, (err, result) => {
    console.log(result.requests.average);

    if (result.statusCodeStats) {
        // Only numbers allowed as index
        console.log(result.statusCodeStats["200"].count);
        console.log(result.statusCodeStats["302"].count);
        console.log(result.statusCodeStats["401"].count);
        console.log(result.statusCodeStats["403"].count);
    }
});

autocannon.track(instance, {
    outputStream: process.stderr,
    renderLatencyTable: true,
    renderProgressBar: false,
    renderResultsTable: false,
    progressBarString: "[:bar] :percent",
});

instance.on("start", () => {});
instance.on("tick", () => {});
instance.on("response", (client, statusCode, resBytes, responseTime) => {
    client.setHeadersAndBody(undefined, undefined);
    console.log(statusCode.toFixed(), resBytes.toFixed(), responseTime.toFixed());
});
instance.on("done", result => console.log(result.throughput.p99_99));
instance.on("error", err => console.error(err));
instance.on("reqError", err => console.error(err));
instance.stop();

autocannon({
    url: "http://localhost:3000",
    requests: [
        {
            // $ExpectType (request: Request, context: object) => Request)
            setupRequest: (request, context) => {
                console.log(request);
                console.log(context);

                return request;
            },
            // $ExpectType (status: number, body: string, context: object, headers: IncomingHttpHeaders | undefined) => void
            onResponse: (status, body, context, headers) => {
                console.log(status);
                console.log(body);
                console.log(context);
                console.log(headers);
            },
        },
        {
            // $ExpectType string
            setupRequest: "bla1.ts",
            // $ExpectType string
            onResponse: "bla2.ts",
        },
        {
            // $ExpectType undefined
            setupRequest: undefined,
            // $ExpectType undefined
            onResponse: undefined,
        },
        {
            // @ts-expect-error
            setupRequest: 5,
            // @ts-expect-error
            onResponse: 5,
        },
        {
            // @ts-expect-error
            setupRequest: {},
            // @ts-expect-error
            onResponse: {},
        },
        {
            // @ts-expect-error
            setupRequest: null,
            // @ts-expect-error
            onResponse: null,
        },
    ],
});
