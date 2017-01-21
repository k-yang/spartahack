from watson_developer_cloud import VisualRecognitionV3
import json
from os.path import join, dirname

visual_recognition = VisualRecognitionV3('2016-05-20', api_key='3e5cc32fd8601944b7d1bf2e0fa69813e96be789')

print(json.dumps(visual_recognition.list_classifiers(), indent=2))

# print(json.dumps(visual_recognition.delete_classifier('SpartaHacks_1858792783')))

# with open(join(dirname(__file__), '../image_data/random/Archive.zip'), 'rb') as random_data, \
#         open(join(dirname(__file__), '../image_data/apple/Archive.zip'), 'rb') as apple_data, \
#         open(join(dirname(__file__), '../image_data/pizza/Archive.zip'), 'rb') as pizza_data, \
#         open(join(dirname(__file__), '../image_data/hamburger/Archive.zip'), 'rb') as hamburger_data:
#     print(json.dumps(visual_recognition.create_classifier('SpartaHacks',
#                                                           random_positive_examples=random_data,
#                                                           apple_positive_examples=apple_data,
#                                                           hamburger_positive_examples=hamburger_data,
#                                                           pizza_positive_examples=pizza_data),
#                      indent=2))
#
# print(json.dumps(visual_recognition.list_classifiers(), indent=2))


with open(join(dirname(__file__), '../image_data/pizza/04df0a57-630f-4be2-a566-ac33b9633e7d.png'), 'rb') as image:
    print(json.dumps(visual_recognition.classify(image, classifier_ids=['SpartaHacks_1703170307']), indent=2))
#
# with open(join(dirname(__file__), '../image_data/hamburger/0cbfbc1d-d1a2-44a6-8d55-b4ac117eb712.png'), 'rb') as image:
#     print(json.dumps(visual_recognition.classify(image, classifier_ids=['SpartaHacks_1703170307']), indent=2))
#
# with open(join(dirname(__file__), '../image_data/pizza/1eccf6e5-e0ed-4387-b756-07040f20f557.png'), 'rb') as image:
#     print(json.dumps(visual_recognition.classify(image, classifier_ids=['SpartaHacks_1703170307']), indent=2))
