from mysql import connector

cnx = connector.connection.MySQLConnection(
    user = 'gestureadmin',
    password = 'SpartansWill',
    host = 'spartahackdb.c6kspdcu44vw.us-east-1.rds.amazonaws.com',
    database = 'gesturedb'
)

cursor = cnx.cursor()

cursor.execute(
    "CREATE TABLE `Requests` ("
    "   `name` varchar(16) NOT NULL,"
    "   `location` varchar(200) NOT NULL,"
    "   `video_url` varchar(400),"
    "   `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP"
    ") ")

cnx.close()
