from watson_developer_cloud import VisualRecognitionV3
import json
from os.path import join, dirname

# visual_recognition = VisualRecognitionV3('2016-05-20', api_key='2ade7a733941d304283b39368435fb386ce2e0dc') # old
visual_recognition = VisualRecognitionV3('2016-05-20', api_key='47687f9277c0a4d104148ae0c9722fa6a54dfaad') # new SpartaHacks_849894342
# visual_recognition = VisualRecognitionV3('2016-05-20', api_key='c4c544a7e6c5747263351da2fc6d918a471d8276')  # new new SpartaHacks_2063549702

CLASSIFIER_ID = 'SpartaHacks_849894342'


def delete_classifier():
    classifier_id = list_all_classifiers()
    if classifier_id:
        print(json.dumps(visual_recognition.delete_classifier(classifier_id)))


def list_all_classifiers():
    classifier_id = None
    data = visual_recognition.list_classifiers()
    if len(data['classifiers']) > 0:
        classifier_id = data['classifiers'][0]['classifier_id']
    print(json.dumps(data, indent=2))
    return classifier_id


def list_classifier():
    classifier_id = list_all_classifiers()
    if classifier_id:
        print(json.dumps(visual_recognition.get_classifier(classifier_id), indent=2))


def create_classifier():
    with open(join(dirname(__file__), '../test_data/apple/Archive.zip'), 'rb') as apple_data, \
            open(join(dirname(__file__), '../test_data/orange/Archive.zip'), 'rb') as orange_data, \
            open(join(dirname(__file__), '../test_data/pasta/Archive.zip'), 'rb') as pasta_data, \
            open(join(dirname(__file__), '../test_data/help/Archive.zip'), 'rb') as help_data, \
            open(join(dirname(__file__), '../test_data/milk/Archive.zip'), 'rb') as milk_data:
        print(json.dumps(visual_recognition.create_classifier('SpartaHacks',
                                                              apple_positive_examples=apple_data,
                                                              orange_positive_examples=orange_data,
                                                              pasta_positive_examples=pasta_data,
                                                              help_positive_examples=help_data,
                                                              milk_positive_examples=milk_data),
                         indent=2))


def classify_image_from_filename(filename):
    intents = {}
    with open(join(dirname(__file__), '../image_data/{}'.format(filename)), 'rb') as data:
        result = visual_recognition.classify(data, classifier_ids=[CLASSIFIER_ID])
        for image in result['images']:
            if len(image['classifiers']) > 0:
                for _class in image['classifiers'][0]['classes']:
                    if _class['class'] not in intents:
                        intents[_class['class']] = _class['score']
                    else:
                        intents[_class['class']] += _class['score']
        print(json.dumps(result, indent=2))

    highest_score = 0
    intent = None
    for key in intents:
        if intents[key] > highest_score:
            highest_score = intents[key]
            intent = key

    return intent


def classify_image_from_filenames(filenames):
    intents = {}

    for filename in filenames:
        with open(join(dirname(__file__), '../image_data/{}'.format(filename)), 'rb') as data:
            result = visual_recognition.classify(data, classifier_ids=[CLASSIFIER_ID])
            for image in result['images']:
                if len(image['classifiers']) > 0:
                    for _class in image['classifiers'][0]['classes']:
                        if _class['class'] not in intents:
                            intents[_class['class']] = _class['score']
                        else:
                            intents[_class['class']] += _class['score']

    highest_score = 0
    intent = None
    for key in intents:
        if intents[key] > highest_score:
            highest_score = intents[key]
            intent = key

    return intent


def classify_image_from_file(file):
    intents = {}
    result = visual_recognition.classify(file, classifier_ids=[CLASSIFIER_ID])
    for image in result['images']:
        if len(image['classifiers']) > 0:
            for _class in image['classifiers'][0]['classes']:
                if _class['class'] not in intents:
                    intents[_class['class']] = _class['score']
                else:
                    intents[_class['class']] += _class['score']
    print(json.dumps(result, indent=2))

    highest_score = 0
    intent = None
    for key in intents:
        if intents[key] > highest_score:
            highest_score = intents[key]
            intent = key

    return intent

# list_all_classifiers()
# delete_classifier()
# create_classifier()
# list_classifier()
# classify_image('bowltest.png')
