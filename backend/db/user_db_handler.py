from logger import logger
from db.user_model import Users
from db.database_handler import DatabaseHandler



class UserDBHandler(DatabaseHandler):
    def __init__(self):
        super().__init__()

    def get_existing_user(self):
        users = {}
        try:
            session = self.SessionLocal()
            users = [
                {"id": user.id, "name": user.name.lower(), "role": user.role.lower()}
                for user in session.query(Users.id, Users.name, Users.role).all()
            ]
            session.close()
        except Exception as e:
            logger.error(f"Error Getting Users: {str(e)}")
        
        finally:
            return users
        
    def get_user_by_id(self, id):
        user = None
        try:
            session = self.SessionLocal()
            user = session.query(Users).filter(Users.id == id).first()
            
            if user:
                return user
            else:
                logger.warning(f"User with id {id} not found")
        except Exception as e:
            logger.error(f"Error Getting User by ID {id}: {str(e)}")
        finally:
            session.close()

        return user
    
    def set_password(self, user_id, hashed_password):
        """Sets the password for a user. Assumes the password is already hashed."""
        try:
            session = self.SessionLocal()
            user = session.query(Users).filter(Users.id == user_id).first()
            
            if user:
                logger.info(f"User found: {user.name}, current password: {user.password}")
                
                # Ensure we're actually getting the password field correctly
                user.password = hashed_password
                session.commit()
                
                # Log after the commit to confirm success
                logger.info(f"Password updated successfully for user with id {user_id}")
            else:
                logger.warning(f"User with id {user_id} not found")
        
        except Exception as e:
            session.rollback()  
            logger.error(f"Error setting password for user {user_id}: {str(e)}")
        
        finally:
            session.close()

    def update_user(self, user_id, updates):
        session = self.SessionLocal()
        user = session.query(Users).filter_by(id=user_id).first()

        if not user:
            return False  # User not found

        for key, value in updates.items():
            setattr(user, key, value)  # Dynamically update only the changed fields

        session.commit() 
        pass
