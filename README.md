# ComplainWall (抱怨墙)

这是一个用于匿名抱怨的平台。

希望可以最终使团队更和谐，其中的成员能不断改善。

当然你也可以用作他途。

你可以随意扩展。实现你自己的抱怨墙.

这里用了firebase作为数据库。暂时还未将数据操作的方法单独抽离。 firebase和一般REST请求后端不同， 不需要get， 可以设置侦听事件，在数据改变时会自动触发获取数据，只要在侦听事件里添加展示列表的功能即可。




Demo: [http://bee0060.github.io/complain-wall/index.html](http://bee0060.github.io/complain-wall/index.html)