import React from 'react';

const mockContext = {
    curUser: {
        "username": "testadminnew",
        "id": 12,
        "first_name": "Admin",
        "last_name": "New",
        "email": "adminnew@kinderly.com",
        "groups": [
            1
        ],
        "permissions": {
            "group": 1,
            "id": 7,
            "list_users": true,
            "edit_users": true,
            "edit_parents": true,
            "list_parents": true,
            "list_children": true,
            "edit_report_cards": true,
            "list_own_children": false,
            "edit_children": true,
            "check_in": true,
            "view_stats": true
        }
    } 
};

const MyContext = React.createContext(mockContext);

export const MyContextProvider = ({ children }) => (
  <MyContext.Provider value={mockContext}>
    {children}
  </MyContext.Provider>
);

export const useMyContext = () => React.useContext(MyContext);

// export const mockUseAuth = jest.mock('../../contexts/useAuth', () => ({
//     useAuth: () => ({curUser: {
//             "username": "testadminnew",
//             "id": 12,
//             "first_name": "Admin",
//             "last_name": "New",
//             "email": "adminnew@kinderly.com",
//             "groups": [
//                 1
//             ],
//             "permissions": {
//                 "group": 1,
//                 "id": 7,
//                 "list_users": true,
//                 "edit_users": true,
//                 "edit_parents": true,
//                 "list_parents": true,
//                 "list_children": true,
//                 "edit_report_cards": true,
//                 "list_own_children": false,
//                 "edit_children": true,
//                 "check_in": true,
//                 "view_stats": true
//             }
//         }
//   })}))