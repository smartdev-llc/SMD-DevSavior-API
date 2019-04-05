switch(process.env.JUNIORVIEC_SCRIPT_MODE){
  case "updateMetadata":
    require("./lib/updateMetadata")(0);
    break;
  default: break;
}
