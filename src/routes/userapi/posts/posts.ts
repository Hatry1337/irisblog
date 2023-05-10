import Express from "express";
import { UserAPIRequest } from "../userapi.js";
import HTTPError from "../../../structs/HTTPError.js";
import { BlogPost } from "../../../models/BlogPost.js";
import Joi from "joi";
import log4js from "log4js";

const routePosts = Express.Router();
const logger = log4js.getLogger("app");

export interface IPostJSON {
    id: string;
    author: {
        id: string;
        username: string;
    },
    header: string;
    body: string;
    postedAt: Date;
    editedAt: Date;
}

export interface IGetPostsQuery {
    authorId?: string;
    limit: number;
    page: number;
}

const GetPostsQuerySchema = Joi.object({
    authorId: Joi.string()
        .optional(),

    limit: Joi.number()
        .min(1)
        .max(100)
        .default(50)
        .optional(),

    page: Joi.number()
        .min(0)
        .default(0)
        .optional(),
});

routePosts.get("/", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        let valQuery = await GetPostsQuerySchema.validateAsync(req.query) as IGetPostsQuery;

        let posts = await BlogPost.scope("full").findAll( {
            where: valQuery.authorId ? { authorId: valQuery.authorId } : undefined,
            limit: valQuery.limit,
            offset: valQuery.limit * valQuery.page
        });

        let postsResponse = posts.map(post => ({
            id: post.postId,
            author: {
                id: post.author.userId,
                username: post.author.username,
            },
            header: post.postHeader,
            body: post.postBody,
            postedAt: post.createdAt,
            editedAt: post.updatedAt
        }) as IPostJSON);

        return res.json(postsResponse);
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("UserAPI:get_posts", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
}) as unknown as Express.RequestHandler);

routePosts.get("/:postId", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        let post = await BlogPost.scope("full").findOne({
            where: {
                postId: req.params.postId
            }
        });

        if(!post) {
            return next(new HTTPError(
                "Post not found.",
                404,
            ));
        }

        return res.json({
            id: post.postId,
            author: {
                id: post.author.userId,
                username: post.author.username,
            },
            header: post.postHeader,
            body: post.postBody,
            postedAt: post.createdAt,
            editedAt: post.updatedAt
        } as IPostJSON);
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("UserAPI:get_post", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
}) as unknown as Express.RequestHandler);

export interface ICreatePostRequest {
    header: string;
    body: string;
}

const CreatePostRequestSchema = Joi.object({
    header: Joi.string()
        .min(1)
        .max(100)
        .required(),

    body: Joi.string()
        .min(1)
        .max(10000)
        .required(),
});

routePosts.post("/", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        let valBody = await CreatePostRequestSchema.validateAsync(req.body) as ICreatePostRequest;

        let post = await BlogPost.create({
            postHeader: valBody.header,
            postBody: valBody.body,
            authorId: req.userapi.userId
        } as BlogPost);

        return res.json({
            id: post.postId,
            postedAt: post.createdAt
        });
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("UserAPI:create_post", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
}) as unknown as Express.RequestHandler);

const EditPostRequestSchema = Joi.object({
    header: Joi.string()
        .min(1)
        .max(100)
        .optional(),

    body: Joi.string()
        .min(1)
        .max(10000)
        .optional(),
}).or("header", "body");

routePosts.patch("/:postId", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        let valBody = await EditPostRequestSchema.validateAsync(req.body) as Partial<ICreatePostRequest>;

        let result = await BlogPost.update({
            ...(valBody.header  ? { postHeader: valBody.header } : {}),
            ...(valBody.body    ? { postBody: valBody.body } : {}),
        }, {
            where: {
                postId: req.params.postId
            } as any //#FIXME
        });

        if(result[0] === 0) {
            return next(new HTTPError(
                "Post not found.",
                404,
            ));
        }

        return res.json({
            id: req.params.postId
        });
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("UserAPI:edit_post", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
}) as unknown as Express.RequestHandler);

routePosts.delete("/:postId", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        let result = await BlogPost.destroy({
            where: {
                postId: req.params.postId
            }
        });

        if(result === 0) {
            return next(new HTTPError(
                "Post not found.",
                404,
            ));
        }

        return res.json({
            id: req.params.postId
        });
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("UserAPI:delete_post", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
}) as unknown as Express.RequestHandler);

export default routePosts;