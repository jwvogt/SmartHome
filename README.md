# Smart Home 499

Smart Home simulation that tracks inside tempurature and allows user to toggle lights & appliances on/off and open/close doors & windows.

Weather API data was used to simulate outdoor tempuratures for demonstrating HVAC functionality.

## Work Breakdown Structure

| key | Task                                      | depends on |    date    |   name | complete? |
| :-- | :---------------------------------------- | :--------: | :--------: | -----: | --------: |
| 1   | design database                           |    None    | 11/5/2021  |   Jack |  complete |
| 2   | generate historic                         |    None    | 11/7/2021  | Dawson |  complete |
| 3   | design backend                            |    None    | 11/10/2021 |   Jack |  complete |
| 4   | design frontend                           |    None    | 11/10/2021 |   Jack |  complete |
| 5   | link backend/frontend                     |   3 & 4    | 11/12/2021 |   Jack |  complete |
| 6   | design icons/logo                         |    None    | 11/27/2021 |   Rauf |  complete |
| 7   | create diagrams                           |    None    | 11/27/2021 |  Jacob |
| 8   | design budget system                      |    None    | 11/27/2021 |   Jack |  complete |
| 9   | add simulation functionality              |    none    | 11/25/2021 |   Jack |  complete |
| 10  | refactor Dashboard screen                 |   11, 12   | 11/24/2021 |   Jack |  complete |
| 11  | overhaul thermostat                       |    none    | 11/24/2021 |   Jack |  complete |
| 12  | refactor sensor toggle system             |    none    | 11/24/2021 |   Jack |  complete |
| 14  | incorporate icons & logo into frontend    |     6      | 11/27/2021 |   Jack |  complete |
| 15  | add sorting to tables on Appliance screen |    none    | 11/25/2021 |   Jack |  complete |
| 16  | fix sorting cuz something is messed up    |     15     | 11/27/2021 |   Jack |

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
