var tokenize = require("./tokenizer/tokenize");
var serializeStyles = require('./writer/simple');
var Token = require('./tokenizer/token');

function isTracking(maps, source) {
    return source in maps;
}

function inputSourceMapTracker() {
    var maps = {};

    return {
        isTracking: isTracking.bind(null, maps),
        originalPositionFor: originalPositionFor.bind(null, maps),
    };
}
function originalPositionFor(maps, metadata, range, selectorFallbacks) {
    var line = metadata[0];
    var column = metadata[1];
    var source = metadata[2];
    var position = {
        line: line,
        column: column + range,
    };
    var originalPosition;

    while (!originalPosition && position.column > column) {
        position.column--;
        originalPosition = maps[source].originalPositionFor(position);
    }

    if (!originalPosition || originalPosition.column < 0) {
        return metadata;
    }

    if (originalPosition.line === null && line > 1 && selectorFallbacks > 0) {
        return originalPositionFor(
            maps,
            [line - 1, column, source],
            range,
            selectorFallbacks - 1
        );
    }

    return originalPosition.line !== null
        ? toMetadata(originalPosition)
        : metadata;
}

function toMetadata(asHash) {
    return [asHash.line, asHash.column, asHash.source];
}

function optimize(tokens) {
    for(let i = tokens.length - 1; i >= 0; i--) {
        let token = tokens[i];

        switch(token[0]) {
            case Token.COMMENT:
                tokens.splice(i, 1)
            break;
            case Token.RULE:
                const list = token[2];
                token[2] = optimize(list);
            break;
            case Token.PROPERTY: 
                const properName = token[1][1];
                if(/^\/\/.*/.test(properName)) {
                    tokens.splice(i, 1)
                }
            break;
        }
    }

    return tokens;
}
function minifyCss(input) {
    var context = {
        stats: {
            efficiency: 0,
            minifiedSize: 0,
            originalSize: 0,
            startedAt: Date.now(),
            timeSpent: 0,
        },
        cache: { specificity: {} },
        errors: [],
        inlinedStylesheets: [],
        inputSourceMapTracker: inputSourceMapTracker(),
        // localOnly: !callback,
        options: {},
        source: null,
        sourcesContent: {},
        // validator: validator(options.compatibility),
        warnings: [],
    };
    let token = tokenize(input, context);
    token = optimize(token);

    var optimizedStyles = serializeStyles(token, context);
    // console.log(JSON.stringify(token))
    return optimizedStyles
}

module.exports = minifyCss;
