<template>
    <div>
        <div>
            <button @click="saveSVG()">saveSVG</button>
            <button @click="saveDiagram()">saveDiagram</button>
        </div>
        <div id="content" class="containers" ref="content">
            <div class="canvas" id="canvas" ref="canvas"></div>
            <div id="js-properties-panel" class="panel"></div>
        </div>
    </div>

</template>

<link rel="stylesheet" href="bpmn-js/dist/assets/diagram-js.css" />
<link rel="stylesheet" href="bpmn-js/dist/assets/bpmn-font/css/bpmn-.css" />

<script>
    // @ is an alias to /src
    // 引入相关的依赖
    import BpmnModeler from 'bpmn-js/lib/Modeler'
    // 右边的工具栏
    import propertiesPanelModule from 'bpmn-js-properties-panel';
    // 左边工具栏以及节点
    import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
    // camunda模块描述符
    import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
    // mini地图
    import miniMapModule from 'diagram-js-minimap';
    import customTranslate from '@/bpmn/customTranslate';

    // import {
    //     newDiagram
    // } from '@/assets/bpmn/bpmn'

    export default {
        data() {
            return {
                // bpmn建模器
                bpmnModeler: null,
                container: null,
                canvas: null
            }
        },
        methods: {
            createNewDiagram() {
                const bpmnXmlStr = '<?xml version="1.0" encoding="UTF-8"?>' +
                                    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                                    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                                                    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                                                    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
                                                    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
                                                    'id="Definitions_1">' +
                                        '<bpmn:process id="Process_1" isExecutable="false">' +
                                            '<bpmn:startEvent id="StartEvent_1"/>' +
                                        '</bpmn:process>' +
                                        '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
                                            '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
                                                '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
                                                    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
                                                '</bpmndi:BPMNShape>' +
                                            '</bpmndi:BPMNPlane>' +
                                        '</bpmndi:BPMNDiagram>' +
                                    '</bpmn:definitions>';

                // 将字符串转换成图显示出来
                this.bpmnModeler.importXML(bpmnXmlStr,  (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        //
                    }
                })
            },
            // 保存svg
            saveSVG() {
                this.bpmnModeler.saveSVG((err, svg) => {
                    if(err){
                        console.error("没有获得svg!")
                    } else {
                        console.log(svg)
                    }
                    // setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
                });
                console.log("保存svg图片")
            },
            // 保存.bpmn
            saveDiagram() {
                this.bpmnModeler.saveXML((err, xml) => {
                    if(err){
                        console.error("没有获得xml!")
                    } else {

                        let encodedData = encodeURIComponent(xml);
                        window.location.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData

                        console.log(xml)
                    }
                    // setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
                });
                console.log("保存svg图片")
            }
        },
        mounted() {
            var customTranslateModule = {
                translate: [ 'value', customTranslate ]
            };

            // 获取到属性ref为“content”的dom节点
            this.container = this.$refs.content
            // 获取到属性ref为“canvas”的dom节点
            this.canvas = this.$refs.canvas
            // 建模
            this.bpmnModeler = new BpmnModeler({
                container: '#canvas',
                // 文本渲染
                textRenderer: {
                    defaultStyle: {
                        fontFamily: '"Nothing You Could Do"',
                        // fontWeight: 'bold',
                        // fontSize: 12,
                        // lineHeight: 16
                    },
                    // externalStyle: {
                    //     fontSize: 12,
                    //     lineHeight: 16
                    // }
                },
                // bpmn渲染
                // bpmnRenderer: {
                //     // 默认填充颜色
                //     defaultFillColor: '#333',
                //     // 默认线条颜色
                //     defaultStrokeColor: '#fff'
                // },
                //添加控制板
                propertiesPanel: {
                    parent: '#js-properties-panel'
                },
                // 附加模块
                additionalModules: [
                    // 左边工具栏以及节点
                    propertiesProviderModule,
                    // 右边的工具栏
                    propertiesPanelModule,
                    // mini地图
                    miniMapModule,
                    // 自定义翻译模块
                    customTranslateModule,
                ]                ,
                moddleExtensions: {
                    // needed if you'd like to maintain camunda:XXX properties in the properties panel
                    camunda: camundaModdleDescriptor
                }
            });
            // 为画布的每个内容添加单击双击事件
            let eventBus = this.bpmnModeler.get('eventBus')
            // select the end event
            const events = [
                'element.click',
                'element.dbclick'
            ]
            events.forEach(((event) => {
                eventBus.on(event, function(e) {
                    console.log(event + ' on ' + e.element.id);
                })
            }))
            // 创建一个新的模型
            this.createNewDiagram()
            // 根据元素监听事件
            let endEventNode = this.canvas.querySelector('g');
            endEventNode.addEventListener('click', (mouseEvent) => {
                console.log('clicked this canvas!' + mouseEvent)
            })
        }
    }
</script>

<style lang="scss">
    /*!*左边工具栏以及编辑节点的样式*!*/
    @import '~bpmn-js/dist/assets/diagram-js.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
    @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
    /*右边工具栏样式*/
    @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';


    .containers {
        position: absolute;
        background-color: #ffffff;
        width: 100%;
        height: 100%;
    }

    .canvas {
        width: 100%;
        height: 100%;
    }

    .panel {
        position: absolute;
        right: 0;
        top: 0;
        width: 300px;
    }
</style>
