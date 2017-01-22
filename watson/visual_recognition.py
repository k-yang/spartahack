from watson_developer_cloud import VisualRecognitionV3
import json
from os.path import join, dirname

visual_recognition = VisualRecognitionV3('2016-05-20', api_key='3e5cc32fd8601944b7d1bf2e0fa69813e96be789')
CLASSIFIER_ID = 'SpartaHacks_1659219344'


def delete_classifier():
    print(json.dumps(visual_recognition.delete_classifier(CLASSIFIER_ID)))


def list_all_classifiers():
    print(json.dumps(visual_recognition.list_classifiers(), indent=2))


def list_classifier():
    print(json.dumps(visual_recognition.get_classifier(CLASSIFIER_ID), indent=2))


def create_classifier():
    with open(join(dirname(__file__), '../test_data/bowl.zip'), 'rb') as bowl_data, \
            open(join(dirname(__file__), '../test_data/apple.zip'), 'rb') as apple_data, \
            open(join(dirname(__file__), '../test_data/orange.zip'), 'rb') as orange_data, \
            open(join(dirname(__file__), '../test_data/pasta.zip'), 'rb') as pasta_data, \
            open(join(dirname(__file__), '../test_data/soup.zip'), 'rb') as soup_data:
        print(json.dumps(visual_recognition.create_classifier('SpartaHacks',
                                                              bowl_positive_examples=bowl_data,
                                                              apple_positive_examples=apple_data,
                                                              orange_positive_examples=orange_data,
                                                              pasta_positive_examples=pasta_data,
                                                              soup_positive_examples=soup_data),
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
