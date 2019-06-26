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
                const bpmnXmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0fppxr8" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
                    '  <bpmn:process id="Process_1" isExecutable="false">\n' +
                    '    <bpmn:startEvent id="StartEvent_1" name="begin&#10;">\n' +
                    '      <bpmn:outgoing>SequenceFlow_0nrfbee</bpmn:outgoing>\n' +
                    '    </bpmn:startEvent>\n' +
                    '    <bpmn:task id="Task_0ho18x0" name="hello&#10;">\n' +
                    '      <bpmn:incoming>SequenceFlow_0nrfbee</bpmn:incoming>\n' +
                    '      <bpmn:outgoing>SequenceFlow_00ho26x</bpmn:outgoing>\n' +
                    '    </bpmn:task>\n' +
                    '    <bpmn:task id="Task_1ymuvem" name="world">\n' +
                    '      <bpmn:incoming>SequenceFlow_00ho26x</bpmn:incoming>\n' +
                    '      <bpmn:outgoing>SequenceFlow_18df8vb</bpmn:outgoing>\n' +
                    '    </bpmn:task>\n' +
                    '    <bpmn:endEvent id="EndEvent_id" name="end">\n' +
                    '      <bpmn:incoming>SequenceFlow_18df8vb</bpmn:incoming>\n' +
                    '    </bpmn:endEvent>\n' +
                    '    <bpmn:sequenceFlow id="SequenceFlow_0nrfbee" sourceRef="StartEvent_1" targetRef="Task_0ho18x0" />\n' +
                    '    <bpmn:sequenceFlow id="SequenceFlow_00ho26x" sourceRef="Task_0ho18x0" targetRef="Task_1ymuvem" />\n' +
                    '    <bpmn:sequenceFlow id="SequenceFlow_18df8vb" sourceRef="Task_1ymuvem" targetRef="EndEvent_id" />\n' +
                    '  </bpmn:process>\n' +
                    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
                    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
                    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
                    '        <dc:Bounds x="173" y="102" width="36" height="36" />\n' +
                    '        <bpmndi:BPMNLabel>\n' +
                    '          <dc:Bounds x="178" y="145" width="27" height="27" />\n' +
                    '        </bpmndi:BPMNLabel>\n' +
                    '      </bpmndi:BPMNShape>\n' +
                    '      <bpmndi:BPMNShape id="Task_0ho18x0_di" bpmnElement="Task_0ho18x0">\n' +
                    '        <dc:Bounds x="485" y="244" width="100" height="80" />\n' +
                    '      </bpmndi:BPMNShape>\n' +
                    '      <bpmndi:BPMNShape id="Task_1ymuvem_di" bpmnElement="Task_1ymuvem">\n' +
                    '        <dc:Bounds x="712" y="391" width="100" height="80" />\n' +
                    '      </bpmndi:BPMNShape>\n' +
                    '      <bpmndi:BPMNShape id="EndEvent_id_di" bpmnElement="EndEvent_id">\n' +
                    '        <dc:Bounds x="1056" y="568" width="36" height="36" />\n' +
                    '        <bpmndi:BPMNLabel>\n' +
                    '          <dc:Bounds x="1065" y="611" width="19" height="14" />\n' +
                    '        </bpmndi:BPMNLabel>\n' +
                    '      </bpmndi:BPMNShape>\n' +
                    '      <bpmndi:BPMNEdge id="SequenceFlow_0nrfbee_di" bpmnElement="SequenceFlow_0nrfbee">\n' +
                    '        <di:waypoint x="209" y="120" />\n' +
                    '        <di:waypoint x="347" y="120" />\n' +
                    '        <di:waypoint x="347" y="284" />\n' +
                    '        <di:waypoint x="485" y="284" />\n' +
                    '      </bpmndi:BPMNEdge>\n' +
                    '      <bpmndi:BPMNEdge id="SequenceFlow_00ho26x_di" bpmnElement="SequenceFlow_00ho26x">\n' +
                    '        <di:waypoint x="585" y="284" />\n' +
                    '        <di:waypoint x="649" y="284" />\n' +
                    '        <di:waypoint x="649" y="431" />\n' +
                    '        <di:waypoint x="712" y="431" />\n' +
                    '      </bpmndi:BPMNEdge>\n' +
                    '      <bpmndi:BPMNEdge id="SequenceFlow_18df8vb_di" bpmnElement="SequenceFlow_18df8vb">\n' +
                    '        <di:waypoint x="812" y="431" />\n' +
                    '        <di:waypoint x="934" y="431" />\n' +
                    '        <di:waypoint x="934" y="586" />\n' +
                    '        <di:waypoint x="1056" y="586" />\n' +
                    '      </bpmndi:BPMNEdge>\n' +
                    '    </bpmndi:BPMNPlane>\n' +
                    '  </bpmndi:BPMNDiagram>\n' +
                    '</bpmn:definitions>\n'
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
            this.createNewDiagram(this.bpmnModeler);

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
