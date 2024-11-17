/**
 * @file some utility functions.
 * @version 0.0.1.2
 */

var CommandLineArguments = Convert.ToNativeArray(Environment.GetCommandLineArgs(), Type.GetTypeHandle(new String())).slice(1);

var AssemblyLocation = Assembly.GetExecutingAssembly().Location;

/** @typedef {object} SWbemLocator */
var SWbemLocator = new SWbemLocatorClass();
/** @typedef {object} SWbemService */
var SWbemService = SWbemLocator.ConnectServer();
/** @typedef {object} StdRegProv */
var StdRegProv = SWbemService.Get('StdRegProv');

/**
 * Generate a random file path.
 * @param {string} extension is the file extension.
 * @returns a random file path.
 */
function GenerateRandomPath(extension) {
  return Path.Combine(Path.GetTempPath(), Guid.NewGuid() + '.tmp' + extension);
}

/**
 * Delete the specified file.
 * @param {string} filePath is the file path.
 */
function DeleteFile(filePath) {
  try {
    File.Delete(filePath);
  } catch (e) { }
}

/**
 * Show the application message box.
 * @param {string} messageText is the message text to show.
 * @param {MessageBoxImage} popupType is the type of popup box.
 * @param {MessageBoxButton} popupButtons are the buttons of the message box.
 */
function Popup(messageText, popupType, popupButtons) {
  if (!popupType) {
    popupType = MessageBoxImage.None;
  }
  if (!popupButtons) {
    popupButtons = MessageBoxButton.OK;
  }
  MessageBox.Show(messageText, "Convert to HTML", MessageBoxButton(popupButtons), MessageBoxImage(popupType));
}

/** Destroy the COM objects. */
function Dispose() {
  Marshal.FinalReleaseComObject(SWbemLocator);
  Marshal.FinalReleaseComObject(SWbemService);
  Marshal.FinalReleaseComObject(StdRegProv);
  StdRegProv = null;
  SWbemService = null;
  SWbemLocator = null;
}

/**
 * Clean up and quit.
 * @param {int} exitCode .
 */
function Quit(exitCode) {
  Dispose();
  CollectGarbage();
  Environment.Exit(exitCode);
}

/**
 * Set the specified property of a SWbemObject instance.
 * @param {SWbemObject} inParams the object to set the property value from.
 * @param {string} propertyName the property name.
 * @param {object} propertyValue the property value.
 */
function SetWBemObjectProperty(inParams, propertyName, propertyValue) {
  var inProperties = inParams.Properties_;
  var property = inProperties.Item(propertyName);
  property.Value = propertyValue;
  Marshal.ReleaseComObject(property);
  Marshal.ReleaseComObject(inProperties);
  inProperties = null;
  property = null;
  inParams = null;
}

/**
 * Get the specified property of a SWbemObject instance.
 * @param {SWbemObject} inParams the object to get the property value from.
 * @param {string} propertyName the property name.
 * @returns {object} the property value.
 */
function GetWBemObjectProperty(outParams, propertyName) {
  var outProperties = outParams.Properties_;
  var property = outProperties.Item(propertyName);
  try {
    return property.Value;
  } finally {
    Marshal.ReleaseComObject(property);
    Marshal.ReleaseComObject(outProperties);
    Marshal.ReleaseComObject(outParams);
    outParams = null;
    outProperties = null;
    property = null;
  }
}