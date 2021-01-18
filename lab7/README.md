1. Go to Kibana > Visualize and create a Pie Chart visualization there. Then create an X-axis bucket and set it up like this:

![lab7](../images/lab7/Screenshot_1.png)

2. Create a Line visualization. Then create an X-axis and Split series buckets and set it up like this: 

![lab7](../images/lab7/Screenshot_2.png)

![lab7](../images/lab7/Screenshot_3.png)

![lab7](../images/lab7/Screenshot_14.png)

3. Go to Management > Dev Tools > Console and run this code: 

`
GET _search
{
"size": 0,
"aggs" : {
    "langs" : {
        "terms" : { "field" : "vehicle_make.keyword",  "size" : 3 }
    }
}}
`

![lab7](../images/lab7/Screenshot_4.png)

