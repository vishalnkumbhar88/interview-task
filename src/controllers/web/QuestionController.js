const Transformer = require('object-transformer');
const Response = require('../../../src/services/Response');
const { Question } = require('../../../src/models');
const {
    SUCCESS,  PER_PAGE, DEFAULT_PAGE, BAD_REQUEST, INTERNAL_SERVER
} = require('../../../src/services/Constants');
const { QueDetails, QueAnsDetails, QuestionDetail } = require('../../../src/transformers/web/QuestionTransformer');
const { QueAnsAddEditValidation } = require('../../../src/services/WebValidation');

module.exports ={
    /**
     * @description "This function is use to List quetion without Login."
     * @param req
     * @param res
     */

QuestionList: async (req, res) => {
    const requestParams = req.query;
    const perPageValue = (requestParams.limit && requestParams.limit > 0) ? parseInt(requestParams.limit, 10) : PER_PAGE;
    const pageNo = (requestParams.offset && requestParams.offset > 0) ? parseInt(requestParams.offset, 10) : DEFAULT_PAGE;
    const query = {};
    if (requestParams.timestamp && requestParams.timestamp !== '') {
        query.updatedAt = { $gt: requestParams.timestamp * 1000 };
    }

    await Question.find(query)
        .skip(perPageValue * (pageNo - 1))
        .limit(perPageValue)
        .then(async (result) => {
            if (result.length > 0) {
                const totalCount = await Question.countDocuments(query);
                const extra = [];
                extra.limit = perPageValue;
                extra.total = totalCount;
                extra.offset = pageNo;
                return Response.successResponseData(res, new Transformer.List(result, QueDetails).parse(), SUCCESS, res.__('success'), extra);
            }
            return Response.successResponseData(res, [], SUCCESS, res.__('noDataFound'));
        });
},

    /**
     * @description "This function is use to List quetion & answer with Login."
     * @param req
     * @param res
     */
       QuestionAnswerList: async (req, res) => {
        const requestParams = req.query;
            const perPageValue = (requestParams.limit && requestParams.limit > 0) ? parseInt(requestParams.limit, 10) : PER_PAGE;
            const pageNo = (requestParams.offset && requestParams.offset > 0) ? parseInt(requestParams.offset, 10) : DEFAULT_PAGE;
            const query = {};
            if (requestParams.timestamp && requestParams.timestamp !== '') {
                query.updatedAt = {$gt: requestParams.timestamp * 1000};
            }
            await Question.find(query)
                .skip(perPageValue * (pageNo - 1))
                .limit(perPageValue)
                .then(async (result) => {
                    if (result.length > 0) {
                        const totalCount = await Question.countDocuments(query);
                        const extra = [];
                        extra.limit = perPageValue;
                        extra.total = totalCount;
                        extra.offset = pageNo;
                        return Response.successResponseData(res, new Transformer.List(result, QueAnsDetails).parse(), SUCCESS, res.__('success'), extra);
                    }
                    return Response.successResponseData(res, [], SUCCESS, res.__('noDataFound'));
                });

    },

    /**
     * @description "This function is use to add-edit quetion & answer."
     * @param req
     * @param res
     */
    addEditQueAns: (req, res) => {
        const requestParam = req.fields;
        QueAnsAddEditValidation(requestParam, res, async (validate) => {
            if (validate) {
                if (requestParam.id) {
                    Question.findOne({
                        _id: { $ne: mongoose.Types.ObjectId(requestParam.id) }
                    }).then((CheckFaqsId) => {
                        if (CheckFaqsId) {
                            Question.updateOne({_id: mongoose.Types.ObjectId(requestParam.id)}, {
                                $set: {
                                    question: requestParam.question,
                                    answer: requestParam.answer
                                }
                            }).then(async (result) => {
                                if (result) {
                                    Question.findOne({
                                        _id: mongoose.Types.ObjectId(requestParam.id),
                                    }).then((codeResult) => {
                                        Response.successResponseData(res, new Transformer.Single(codeResult, QuestionDetail).parse(), SUCCESS, res.__('QuetionUpdatedSuccessfully'));
                                    });
                                } else {
                                    Response.errorResponseData(res, res.__('somethingWentWrong'), BAD_REQUEST);
                                }
                            }, () => Response.errorResponseData(res, res.__('InternalServerError'), INTERNAL_SERVER));
                        } else {
                            Response.successResponseWithoutData(res, res.__('IdDoesNotExist'), FAIL);
                        }
                    });
                } else {
                    const QuesData = {
                        question: requestParam.question,
                        answer: requestParam.answer
                    };
                    Question.create(QuesData).then(async (result) => {
                        if (result) {
                            Response.successResponseData(res, new Transformer.Single(result, QuestionDetail).parse(), SUCCESS, res.__('QuestionAddedSuccessfully'));
                        } else {
                            Response.errorResponseData(res, res.__('somethingWentWrong'), BAD_REQUEST);
                        }
                    });
                }
            }
        });
    },

};