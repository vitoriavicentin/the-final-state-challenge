process.stdin.resume();
process.stdin.setEncoding('utf-8');

var input_ = "";

process.stdin.on('data', function (data) {
    input_ += data.toString().trim();
    input_ += '\n';
});

function solution(n, actions) {
    const stateTransitions = {
        CLOSED: {
            APP_PASSIVE_OPEN: 'LISTEN',
            APP_ACTIVE_OPEN: 'SYN_SENT'
        },
        LISTEN: {
            RCV_SYN: 'SYN_RCVD',
            APP_SEND: 'SYN_SENT',
            APP_CLOSE: 'CLOSED'
        },
        SYN_RCVD: {
            APP_CLOSE: 'FIN_WAIT_1',
            RCV_ACK: 'ESTABLISHED'
        },
        SYN_SENT: {
            RCV_SYN: 'SYN_RCVD',
            RCV_SYN_ACK: 'ESTABLISHED',
            APP_CLOSE: 'CLOSED'
        },
        ESTABLISHED: {
            APP_CLOSE: 'FIN_WAIT_1',
            RCV_FIN: 'CLOSE_WAIT'
        },
        FIN_WAIT_1: {
            RCV_FIN: 'CLOSING',
            RCV_FIN_ACK: 'TIME_WAIT',
            RCV_ACK: 'FIN_WAIT_2'
        },
        CLOSING: {
            RCV_ACK: 'TIME_WAIT'
        },
        FIN_WAIT_2: {
            RCV_FIN: 'TIME_WAIT'
        },
        TIME_WAIT: {
            APP_TIMEOUT: 'CLOSED'
        },
        CLOSE_WAIT: {
            APP_CLOSE: 'LAST_ACK'
        },
        LAST_ACK: {
            RCV_ACK: 'CLOSED'
        }
    };

    let currentState = 'CLOSED';

    for (const event of actions) {
        const nextState = stateTransitions[currentState][event];
        if (!nextState) {
            return 'ERROR';
        }
        currentState = nextState;
    }

    return currentState;

}

process.stdin.on('end', function () {
    input_ = input_.replace(/\n$/, "");
    input_ = input_.split("\n");

    var idx_ = 0;
    var n = parseInt(input_[idx_++].trim(), 10);
    var actions = input_[idx_++].trim().split(' ')

    var out_ = solution( n,  actions);
    process.stdout.write(out_.toString());

    process.exit();

});