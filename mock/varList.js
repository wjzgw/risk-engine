export default {
	'POST /engine/varList/list': (req, res) => {
	    res.send({
	      status: 'ok',
	      data:[
	        {
	          id:1,
	          oneclass:'反欺诈',
	          oneclassId:1,
	          twoclass:'注册',
	          twoclassId:1,
	          varname:'注册时间',
	          varcode:'变量代码',
	          vartype:'变量类型',
	          isenmu:'否',
	          length:22,
	          defVal:'男',
	          max:88,
	          min:11,
	          enmuval:'男、女',
	          status:1,
	          updateTime:'2019-07-29'
	        },
	        {
	          id:2,
	          oneclass:'反欺诈',
	          oneclassId:1,
	          twoclassId:1,
	          twoclass:'注册',
	          varname:'注册时间',
	          varcode:'变量代码',
	          vartype:'变量类型',
	          isenmu:'否',
	          length:22,
	          defVal:'男',
	          max:88,
	          min:11,
	          enmuval:'男、女',
	          status:0,
	          updateTime:'2019-07-29'
	        }
	      ]
	  })
	},
	
	'POST /engine/varList/getEnumeration': (req, res) => {
	    res.send({
	      status: 'ok',
	      data:[
	        {
	        	id:1,
	        	value:11,
	        	valueShow:'是'
	        }
	      ]
	  })
	}
}