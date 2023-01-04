const router = require("express").Router();
const { Notes, FetchNotes,Addnotes,updatenotes , deletenotes, UserRequest} = require("../controller/Note_route");
//Register

router.post("/Notes", Notes);
router.get("/Note/FetchNotes", FetchNotes);
router.post("/Note/AddNotes",Addnotes );
router.patch("/Note/UpdateNotes", updatenotes);
router.delete("/Note/DeleteNotes/:id",  deletenotes);
router.delete("/Note/DeleteSubNotes/:id/:sub_id",  deletenotes);
router.get("/get_note/processes",   UserRequest);
module.exports=router