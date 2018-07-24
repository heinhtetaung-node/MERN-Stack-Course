const Post = require('./../models/Post')

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
			.populate('author').populate({path:'comments.author', select:'name'})   // here is little need to change to get comments also
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
		Post.find().populate('author').exec((err, posts)=> {
            if (err)
                res.send(err)
            else if (!posts)
                res.send(404)
            else
                res.send(posts)
            next()            
        })

	}
}