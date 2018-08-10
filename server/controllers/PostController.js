const Post = require('./../models/Post')
const Tag = require('./../models/Tag')
const url = require('url')

module.exports = {  
	addPost : (req, res, next) => {		
		const savepost = req.body;
		const post = new Post(savepost); 
		if(!savepost._id){
			post.save((err, newpost) => {
				if(err)
					res.send(err)
				else if(!newpost)
					res.send(400)
				else
					res.send(newpost)
				next()
			});
		}else{
			Post.findById(req.body._id, function(err, post){ 
				if(err) return handleError(err);	
				post.set(savepost);		
				post.save((err, updatePost) => {
					if(err)
						res.send(err)
					else if(!updatePost)
						res.send(400)
					else
						res.send(updatePost)
					next()
				});

			});
		}
	},
	getPost : (req, res, next) => {
		const postid = req.params.id;
		Post.findById(postid)  // the tricky part is here we need to get user object also in detail
			.populate('tags').populate('author').populate({path:'comments.author', select:'name'})   // here is little need to change to get comments also
			// it also okay by doing populate('comments.author') directly. But I afraid to big json can harm performance
			// that's why select only name from author.	Lets' run
			.exec((err, post)=> {  
            if (err)
                res.send(err)
            else if (!post)
                res.send(404)
            else
                res.send(post)
            next()            
        })
	},
	getAllPost : (req, res, next) => {
		const filter = {};
		const query = url.parse(req.url,true).query;
		if(query.author){
			filter.author = query.author;
		}
		if(query.keyword){
			// NodeJs Mongoose find like Reference from
			// https://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
			const keyword = new RegExp(query.keyword, 'i'); // it return /keyword/i            

			// NodeJs Mongoose query find OR Reference From
			// https://stackoverflow.com/questions/33898159/mongoose-where-query-with-or
			filter.$or = [{title: keyword}, {description:keyword}]
		}
		if(query.tags){
			// NodeJs Mongoose query find by Id Reference From
			// https://stackoverflow.com/questions/5818303/how-do-i-perform-an-id-array-query-in-mongoose
			const tagsarr = query.tags.split(",");
			filter.tags = {$in : tagsarr};  // where tagsId IN(1,2,3)
		}
		Post.find(filter).populate('author').populate('tags').exec((err, posts)=> {
            if (err)
                res.send(err)
            else if (!posts)
                res.send(404)
            else
                res.send(posts)
            next()            
        })

	},

	/* the post data is like this
	{
		"title" : "Post tag",
		"description" : "desc",
		"author" : "5b4ea96dae7e19175c2faee6",
		"tags" : ["php", "java"]
	}
	*/
	savePostAndTag : (req, res, next) => {	// without using async, how complex	
		// first save tag
		const request = req.body
		const tags = request.tags.map(function(item, index){
			return { title : item };  // this is loop and prepare tags array to save,
		})
		
		Tag.insertMany(tags, {ordered:false}, function(err, savedtags){
			if(err){ 
				if(err.code=="11000"){  // 11000 is duplicate error code
					Tag.find({ "title": { "$in" : request.tags }}).then(function(data){
						const post = new Post(request);
						post.tags = data.map(function(item, index){
							return item._id
						})
						post.save((err, savedpost) => {
							if(err){
								res.send(err);
							}else{
								res.send({post: savedpost, tags:data});
							}
						})
					})
				}else{
					res.send(err);
				}
			}else{
				const post = new Post(request);
				post.tags = savedtags.map(function(item, index){
					return item._id
				})
				post.save((err, savedpost) => {
					if(err){
						res.send(err);
					}else{
						res.send({post: savedpost, tags:savedtags});
					}
				})
			}
		})		
	},

	/* Post data
	{
		"title" : "Post tag",
		"description" : "desc",
		"author" : "5b4ea96dae7e19175c2faee6",
		"tags" : ["php", "java"]
	}
	*/
	savePostAndTagAsync : async (req, res, next) => { // to use async, need to add async in ()
		const request = req.body;
		let returnres;
		if(request._id){
			const post = await Post.findById(request._id)
			returnres = await post.savePostTags(request);		
		}else{
			const post = new Post();		
			returnres = await post.savePostTags(request);
		}		
		res.send(returnres);
	},

	getAlltags : (req, res, next) => {
		Tag.aggregate([
            { "$project": {
                "value": "$_id",
                "label": "$title",
            }}
        ], function (err, tags) {
            if (err)
                res.send(err)
            else if (!tags)
                res.send(404)
            else
                res.send(tags)
            next()            
        });

	},	
	removepost : (req, res, next) => {
		const request = req.body
		Post.findByIdAndRemove(request._id, (err, post) => {
			if(err){
				res.send(err);
			}else{
				res.send({post: post, message:'deleted'});
			}
		});
	}
}