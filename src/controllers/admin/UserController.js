const Transformer = require('object-transformer');
const Response = require('../../services/Response');
const mongoose = require('mongoose');
const {
    SUCCESS, PER_PAGE, DEFAULT_PAGE, ACTIVE, INACTIVE, INTERNAL_SERVER, FAIL, BAD_REQUEST
} = require('../../services/Constants');
const { User, Question} = require('../../models');
const { UsersDetail} = require('../../transformers/admin/UserTransformer');

module.exports = {
    /**
     * @description "This function is use to user List."
     * @param req
     * @param res
     */
    userList: async (req, res) => {
        const requestParams = req.query;
        const perPageValue = (requestParams.per_page && requestParams.per_page > 0) ? parseInt(requestParams.per_page, 10) : PER_PAGE;
        const pageNo = (requestParams.page && requestParams.page > 0) ? parseInt(requestParams.page, 10) : DEFAULT_PAGE;
        const query = {};

        query.status = {$in: [ACTIVE,INACTIVE]};

        let sorting = [
            ['createdAt', 'DESC']
        ];
        if (requestParams.order_by && requestParams.order_by !== '') {
            sorting = [
                [requestParams.order_by, requestParams.direction ? requestParams.direction : 'DESC']
            ];
        }
        await User.find(query)
            .collation({locale: 'en'})
            .skip(perPageValue * (pageNo - 1))
            .limit(perPageValue)
            .sort(sorting)
            .then(async (result) => {
                if (result.length > 0) {
                    const totalCount = await User.countDocuments(query);
                    const extra = [];
                    extra.per_page = perPageValue;
                    extra.total = totalCount;
                    extra.page = pageNo;
                    return Response.successResponseData(res, new Transformer.List(result, UsersDetail).parse(), SUCCESS, res.__('success'), extra);
                }
                return Response.successResponseData(res, [], SUCCESS, res.__('noDataFound'));
            });
    },

    /**
     * @description "This function is use to delete user."
     * @param req
     * @param res
     */
    deleteUser: async (req, res) => {
        const checkId = req.params.id;
        if (checkId.match(/^[0-9a-fA-F]{24}$/) === null) {
            Response.errorResponseData(res, res.__('UserIdInvalid'));
        } else {
            User.findOne({_id: mongoose.Types.ObjectId(checkId)})
                .then(async (result) => {
                    if (result) {
                        const updateObj = result;
                        updateObj.status = INACTIVE;
                        User.updateOne({_id: mongoose.Types.ObjectId(checkId)}, updateObj)
                            .then(async () => {
                                    Response.successResponseData(res, null, SUCCESS, res.__('UserDeletedSucessFully'));
                                },
                                () => {
                                    Response.errorResponseData(res, res._('somethingWentWrong'), INTERNAL_SERVER);
                                });
                    }
                });
        }
    },


    /**
     * @description "This function is use to list of question and ans particular user."
     * @param req
     * @param res
     */
    QuetionList: async (req, res) => {
    const requestParams = req.query;
    const perPageValue = (requestParams.per_page && requestParams.per_page > 0) ? parseInt(requestParams.per_page, 10) : PER_PAGE;
    const pageNo = (requestParams.page && requestParams.page > 0) ? parseInt(requestParams.page, 10) : DEFAULT_PAGE;
    let sorting = [
        ['createdAt', 'DESC']
    ];
    if (requestParams.order_by && requestParams.order_by !== '') {
    sorting = [
        [requestParams.order_by, requestParams.direction ? requestParams.direction : 'DESC']
    ];
}
await Question.find()
    .skip(perPageValue * (pageNo - 1))
    .limit(perPageValue)
    .sort(sorting)
    .then(async (result) => {
        if (result.length > 0) {
            const totalCount = await User.countDocuments();
            const extra = [];
            extra.per_page = perPageValue;
            extra.total = totalCount;
            extra.page = pageNo;
            return Response.successResponseData(res, result, SUCCESS, res.__('success'), extra);
        }
        return Response.successResponseData(res, [], SUCCESS, res.__('noDataFound'));
    });
},

}