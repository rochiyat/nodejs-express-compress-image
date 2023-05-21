

function returnSuccess (req, data, res) {
    const success = {
        status: 'OK',
        message: 'Successfully',
        data: data
    }
    res.status(200).send(success);
}

function returnNonSuccess (req, message, error, res) {
    const failed = {
        status: 'ERROR',
        message: message || error.message,
        data: null
    }
    res.status(500).send(failed);
}

module.exports = {
    returnSuccess,
    returnNonSuccess,
};